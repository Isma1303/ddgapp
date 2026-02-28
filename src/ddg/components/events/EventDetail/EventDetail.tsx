import { useEffect, useRef, useState } from "react";
import { useEvents } from "../../../hooks/useEvents";
import { Toast } from "primereact/toast";
import { MainLayout } from "../../Layout/MainLayout";
import type { IEvent } from "../../../interfaces/event.interface";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Chip } from "primereact/chip";
import { Checkbox } from "primereact/checkbox";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { useScreenService } from "../../../../system/shared/services/screen.service";
import { EventService } from "../../../services/events.service";

export const EventDetail = () => {
  const { assignUserToEvent, loadEventDetail, getUsersbyEvent, getUnassignedUsers, sendReminder } = useEvents();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const [unassignedUsers, setUnassignedUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
  const { sizes } = useScreenService();
  const eventService = new EventService();

  const isMobile = sizes["screen-x-small"] || sizes["screen-small"];

  useEffect(() => {
    const loadEvent = async () => {
      const event_id = window.location.pathname.split("/").pop();

      if (!event_id) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo cargar el evento.",
          life: 3000,
        });
        return;
      }

      try {
        setLoading(true);
        const eventData = await loadEventDetail(Number(event_id));
        setEvent(eventData);

        const usersData = await getUsersbyEvent(Number(event_id));
        setAssignedUsers(usersData || []);

        const unassigned = await getUnassignedUsers(Number(event_id));
        setUnassignedUsers(Array.isArray(unassigned) ? unassigned : []);
      } catch (error) {
        console.error("Error loading event:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo cargar el evento.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, []);

  const sendEventReminder = async () => {
    try {
      await sendReminder(event?.service_event_id || 0);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Recordatorio enviado correctamente.",
        life: 3000,
      });
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo enviar el recordatorio.",
        life: 3000,
      });
    }
  }

  const filteredUsers = unassignedUsers.filter(user =>
    user.user_nm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSelectedUserObjects = () => {
    return unassignedUsers.filter(user => selectedUsers.includes(user.user_id));
  };

  const handleUserToggle = (user_id: number) => {
    setSelectedUsers(prev =>
      prev.includes(user_id)
        ? prev.filter(id => id !== user_id)
        : [...prev, user_id]
    );
  };

  const handleClearSelection = () => {
    setSelectedUsers([]);
  };

  const handleRemoveAssignedUser = async (user_id: number) => {
    try {
      await eventService.deleteUserFromEvent(event?.service_event_id || 0, user_id);
      toast.current?.show({
        severity: "info",
        summary: "Información",
        detail: "Usuario eliminado del evento correctamente.",
        life: 3000,
      });
      
      if (event) {
        const updatedUsers = await getUsersbyEvent(event.service_event_id);
        setAssignedUsers(updatedUsers || []);
      }
    } catch (error) {
      console.error("Error removing user:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo remover el usuario.",
        life: 3000,
      });
    }
  };

  const handleConfirmAssignment = async () => {
    try {
      const event_id = event?.service_event_id || 0;
      
      for (const user_id of selectedUsers) {
        await assignUserToEvent(event_id, user_id);
      }
      
      const updatedUsers = await getUsersbyEvent(event_id);
      setAssignedUsers(updatedUsers || []);
      
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `${selectedUsers.length > 1 ? selectedUsers.length + " usuarios asignados" : selectedUsers.length + " usuario asignado"} correctamente.`,
        life: 3000,
      });
      setVisible(false);
      setSelectedUsers([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Error assigning users:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron asignar los usuarios al evento.",
        life: 3000,
      });
    }
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  return (
    <MainLayout>
      <Toast ref={toast} />
      
      {loading ? (
        <div className="content-block">
          <p>Cargando evento...</p>
        </div>
      ) : event ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Card style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "flex-start", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                <div
                  style={{
                    width: isMobile ? "64px" : "80px",
                    height: isMobile ? "64px" : "80px",
                    backgroundColor: "#F3F4F6",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className="pi pi-calendar" style={{ fontSize: "2rem", color: "#3B82F6" }}></i>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <h2 style={{ margin: 0 }}>{event.service_nm}</h2>
                    <Tag
                      value={event.is_active ? "Activo" : "Inactivo"}
                      severity={event.is_active ? "success" : "danger"}
                    />
                  </div>
                  <p style={{ margin: "0.25rem 0", color: "#6B7280", fontSize: "0.875rem" }}>
                    <i className="pi pi-users" style={{ marginRight: "0.5rem" }}></i>
                    {assignedUsers.length} Usuarios asignados
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: isMobile ? "flex-end" : "flex-start", flexWrap: "wrap" }}>
                <Button
                  icon="pi pi-bell"
                  label="Enviar Recordatorio"
                  onClick={sendEventReminder}
                />
                <Button
                  icon="pi pi-user-plus"
                  label="Asignar Usuarios"
                  onClick={() => setVisible(true)}
                />
              </div>
            </div>
          </Card>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <i className="pi pi-info-circle" style={{ color: "#3B82F6" }}></i>
              <h3 style={{ margin: 0 }}>Información General</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
              <Card style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <i className="pi pi-calendar" style={{ fontSize: "1.25rem", color: "#3B82F6" }}></i>
                  <div>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6B7280", fontSize: "0.875rem" }}>
                      Fecha del Evento
                    </p>
                    <p style={{ margin: 0, fontWeight: "500" }}>
                      {new Date(event.service_date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </Card>

              <Card style={{ padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <i className="pi pi-clock" style={{ fontSize: "1.25rem", color: "#3B82F6" }}></i>
                  <div>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#6B7280", fontSize: "0.875rem" }}>
                      Horario Programado
                    </p>
                    <p style={{ margin: 0, fontWeight: "500" }}>
                      {formatTime(event.start_time)} - {formatTime(event.end_time)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <i className="pi pi-users" style={{ color: "#3B82F6" }}></i>
              <h3 style={{ margin: 0 }}>Usuarios Asignados</h3>
            </div>
            
            {assignedUsers.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {assignedUsers.map((user: any) => (
                  <Card key={user.user_id} style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Avatar
                          label={user.user_nm.charAt(0).toUpperCase()}
                          shape="circle"
                          style={{ backgroundColor: "#3B82F6", color: "#fff" }}
                        />
                        <div>
                          <p style={{ margin: "0 0 0.25rem 0", fontWeight: "500" }}>
                            {user.user_nm}
                          </p>
                          <p style={{ margin: 0, color: "#6B7280", fontSize: "0.875rem" }}>
                            {user.email || "sin-email@example.com"}
                          </p>
                        </div>
                      </div>
                      <Button
                        icon="pi pi-times"
                        className="p-button-rounded p-button-danger p-button-text align-self-end"
                        onClick={() => handleRemoveAssignedUser(user.user_id)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card style={{ padding: "2rem", textAlign: "center" }}>
                <p style={{ color: "#6B7280" }}>No hay usuarios asignados aún.</p>
              </Card>
            )}
          </div>

          <Dialog
            visible={visible}
            onHide={() => {
              setVisible(false);
              setSelectedUsers([]);
              setSearchTerm("");
            }}
            header="Asignar Usuarios al Evento"
            modal={true}
            style={{ width: "50vw" }}
            breakpoints={{ "992px": "75vw", "576px": "95vw" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <i 
                  className="pi pi-search" 
                  style={{ 
                    position: "absolute", 
                    left: "0.75rem", 
                    top: "50%", 
                    transform: "translateY(-50%)",
                    color: "#9CA3AF"
                  }} 
                />
                <InputText                    
                  placeholder="Buscar por nombre o correo electrónico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: "100%",
                    paddingLeft: "2.5rem"
                  }}
                />
              </div>

              <div>
                <h4 style={{ marginBottom: "0.5rem", color: "#6B7280" }}>
                  SUGERENCIAS
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {filteredUsers.map((user) => (
                    <div
                      key={user.user_id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.5rem",
                        borderRadius: "0.375rem",
                        backgroundColor: selectedUsers.includes(user.user_id)
                          ? "#F3F4F6"
                          : "transparent",
                      }}
                    >
                      <Checkbox
                        checked={selectedUsers.includes(user.user_id)}
                        onChange={() => handleUserToggle(user.user_id)}
                      />
                      <Avatar
                        label={user.user_nm.charAt(0).toUpperCase()}
                        shape="circle"
                        style={{ backgroundColor: "#3B82F6", color: "#fff" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "500", fontSize: "0.875rem" }}>
                          {user.user_nm}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                          {user.email || "sin-email@example.com"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h4 style={{ margin: 0, color: "#6B7280" }}>
                      {selectedUsers.length > 1 ? "USUARIOS SELECCIONADOS" : "USUARIO SELECCIONADO"}
                    </h4>
                    <Button
                      label="Limpiar todo"
                      link
                      size="small"
                      onClick={handleClearSelection}
                      style={{ padding: 0, color: "#3B82F6" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    {getSelectedUserObjects().map((user) => (
                      <Chip
                        key={user.user_id}
                        label={user.user_nm}
                        onRemove={() => {
                          handleUserToggle(user.user_id);
                          return true;
                        }}
                        icon="pi pi-user"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                <Button
                  label="Cancelar"
                  severity="secondary"
                  onClick={() => {
                    setVisible(false);
                    setSelectedUsers([]);
                    setSearchTerm("");
                  }}
                />
                <Button
                  label="Confirmar Asignación"
                  onClick={handleConfirmAssignment}
                  disabled={selectedUsers.length === 0}
                />
              </div>
            </div>
          </Dialog>
        </div>
      ) : (
        <div className="no-events-state">
          <i className="pi pi-calendar-times" style={{ fontSize: "3rem" }}></i>
          <p>No se pudo cargar el evento.</p>
        </div>
      )}
    </MainLayout>
  );
};
