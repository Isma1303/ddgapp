import { useState, useEffect } from "react";
import { MainLayout } from "../../Layout/MainLayout";
import { useEvents } from "../../../hooks/useEvents";
import type { IEventNew, IEvent } from "../../../interfaces/event.interface";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";
import "./NewEvent.css";
import { DepartmentService } from "../../../services/departments.service";
import type { IDepartment } from "../../../interfaces/department.interface";
import { Dropdown } from "primereact/dropdown";

export const NewEvent = () => {
  const navigate = useNavigate();
  const {
    events,
    loading,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const departmentService = new DepartmentService();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<IEventNew>({
    service_nm: "",
    service_date: "",
    start_time: "",
    end_time: "",
    is_active: true,
    department_id: 0,
  });

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response: any = await departmentService.getAll();

      const list: IDepartment[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      setDepartments(list);
    };
    fetchDepartments();
  }, []);

  const resetForm = () => {
    setNewEvent({
      service_nm: "",
      service_date: "",
      start_time: "",
      end_time: "",
      is_active: true,
      department_id: 0,
    });
    setIsEditing(false);
    setSelectedEventId(null);
  };

  const handleEdit = (event: IEvent) => {
    setNewEvent({
      service_nm: event.service_nm,
      service_date: event.service_date,
      start_time: event.start_time,
      end_time: event.end_time,
      is_active: event.is_active,
      department_id: event.department_id,
    });
    setSelectedEventId(event.service_event_id);
    setIsEditing(true);
    setVisible(true);
  };

  const handleSubmit = async () => {
    if (
      !newEvent.service_nm ||
      !newEvent.service_date ||
      !newEvent.start_time ||
      !newEvent.end_time
    ) {
      return;
    }

    if (isEditing && selectedEventId) {
      await updateEvent(selectedEventId, newEvent);
    } else {
      await createEvent(newEvent);
    }

    setVisible(false);
    resetForm();
  };

  const headerElement = (
    <div className="event-list-header">
      <div className="header-info">
        <h1>Próximos Eventos</h1>
        <p>Gestiona y visualiza todos tus eventos institucionales</p>
      </div>
      <Button
        label="Nuevo Evento"
        icon="pi pi-plus"
        className="p-button-rounded p-button-raised add-event-btn"
        onClick={() => setVisible(true)}
      />
    </div>
  );

  const eventFormFooter = (
    <div className="form-footer">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setVisible(false)}
      />
      <Button
        label={isEditing ? "Actualizar Evento" : "Guardar Evento"}
        icon="pi pi-check"
        className="p-button-primary gradient-btn"
        onClick={handleSubmit}
      />
    </div>
  );

  const isActiveBody = (rowData: any) => {
    const icon = rowData.is_active ? "pi pi-verified" : "pi pi-times-circle";
    const style = rowData.is_active
      ? { backgroundColor: "#E0F9E8", color: "#1B9C31", alignItems: "center" }
      : { backgroundColor: "#FFEAEA", color: "#EF4444", alignItems: "center" };

    return (
      <Tag
        value={rowData.is_active ? "Activo" : "Inactivo"}
        icon={icon}
        style={style}
        rounded
      />
    );
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    return time.substring(0, 5);
  };


  const onEventClick = (event: IEvent) => {
    navigate(`/events/detail/${event.service_event_id}`);
  }

  return (
    <MainLayout>
      <div className="new-event-container">
        {headerElement}

        {loading ? (
          <div className="flex justify-content-center align-items-center h-20rem">
            <ProgressSpinner />
          </div>
        ) : (
          <div className="events-grid-container">
            {events && events.length > 0 ? (
              events.map((event: IEvent, index) => (
                <Card
                  key={event.service_event_id || index}
                  className="event-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                 
                >
                  <div className="card-header">
                    <div className="date-badge">
                      <span className="month">
                        {new Date(event.service_date)
                          .toLocaleString("default", { month: "short" })
                          .toUpperCase()}
                      </span>
                      <span className="day">
                        {new Date(event.service_date).getDate()}
                      </span>
                    </div>
                    {isActiveBody(event)}
                  </div>
                  <div className="card-content">
                    <h3>{event.service_nm}</h3>
                    <div className="time-info">
                      <i className="pi pi-clock"></i>
                      <span>
                        {formatTime(event.start_time)} -{" "}
                        {formatTime(event.end_time)}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-danger p-button-text"
                      onClick={() => deleteEvent(event.service_event_id)}
                    />
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-rounded p-button-info p-button-text"
                      onClick={() => handleEdit(event)}
                    />
                    <Button
                      icon="pi pi-eye"
                      className="p-button-rounded p-button-success p-button-text"
                      tooltip="Ver Detalle"
                       onClick={() => onEventClick(event)}
                    />
                  </div>
                </Card>
              ))
            ) : (
              <div className="no-events-state">
                <i
                  className="pi pi-calendar-times"
                  style={{ fontSize: "3rem" }}
                ></i>
                <p>No hay eventos programados. ¡Crea uno nuevo!</p>
              </div>
            )}
          </div>
        )}

        <Dialog
          header={isEditing ? "Editar Evento" : "Crear Nuevo Evento"}
          visible={visible}
          className="event-dialog"
          style={{ width: "450px" }}
          breakpoints={{ "992px": "75vw", "576px": "95vw" }}
          modal
          footer={eventFormFooter}
          onHide={() => {
            setVisible(false);
            resetForm();
          }}
        >
          <div className="event-form">
            <div className="field">
              <label htmlFor="service_nm">Nombre del Evento</label>
              <InputText
                id="service_nm"
                value={newEvent.service_nm}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, service_nm: e.target.value })
                }
                placeholder="Ej. Reunión Mensual"
                className="w-full"
              />
            </div>
            <div className="field">
              <label htmlFor="department_id">Departamento</label>
              <Dropdown
                id="department_id"
                value={newEvent.department_id}
                options={departments.map((department: IDepartment) => ({
                  label: department.department_nm,
                  value: department.department_id,
                }))}
                onChange={(event) => setNewEvent({ ...newEvent, department_id: event.value as number })}
                placeholder="Seleccione un departamento"
                className="w-full"
              />
            </div>
            <div className="field">
              <label htmlFor="service_date">Fecha</label>
              <Calendar
                id="service_date"
                value={
                  newEvent.service_date ? new Date(newEvent.service_date) : null
                }
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    service_date: e.value ? e.value.toISOString() : "",
                  })
                }
                dateFormat="dd/mm/yy"
                showIcon
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <div className="field flex-1">
                <label htmlFor="start_time">Hora Inicio</label>
                <Calendar
                  id="start_time"
                  value={
                    newEvent.start_time
                      ? new Date(`1970-01-01T${newEvent.start_time}`)
                      : null
                  }
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      start_time: e.value
                        ? e.value.toTimeString().split(" ")[0].substring(0, 5)
                        : "",
                    })
                  }
                  timeOnly
                  hourFormat="24"
                  className="w-full"
                />
              </div>
              <div className="field flex-1">
                <label htmlFor="end_time">Hora Fin</label>
                <Calendar
                  id="end_time"
                  value={
                    newEvent.end_time
                      ? new Date(`1970-01-01T${newEvent.end_time}`)
                      : null
                  }
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      end_time: e.value
                        ? e.value.toTimeString().split(" ")[0].substring(0, 5)
                        : "",
                    })
                  }
                  timeOnly
                  hourFormat="24"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </MainLayout>
  );
};
