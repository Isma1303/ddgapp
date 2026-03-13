import { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "../../components/Layout/MainLayout";
import { QrScanner } from "../components/QrScanner";
import { useUserCards } from "../hooks/useUserCards";
import { useUserCardCatalogs } from "../hooks/useUserCardCatalogs";
import type { RegisterAttendanceResponse } from "../interfaces/user-card.interface";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import type { IEvent } from "../../interfaces/event.interface";
import "./UserCards.css";

const mapEventOptionLabel = (event: IEvent): string => {
  return `${event.service_nm} - ${event.service_date}`;
};

export const UserCardAttendancePage = () => {
  const toast = useRef<Toast>(null);
  const lastProcessedScanRef = useRef<string>("");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [scanDialogVisible, setScanDialogVisible] = useState(false);
  const [response, setResponse] = useState<RegisterAttendanceResponse | null>(
    null,
  );

  const { loading: loadingAction, error, registerAttendance } = useUserCards();
  const { loading: loadingCatalogs, loadEvents } = useUserCardCatalogs();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const eventResponse = await loadEvents();
        setEvents(eventResponse);
      } catch {
        setEvents([]);
      }
    };

    void bootstrap();
  }, [loadEvents]);

  const eventOptions = useMemo(
    () =>
      events.map((event) => ({
        label: mapEventOptionLabel(event),
        value: event.service_event_id,
      })),
    [events],
  );

  const handleScanAndRegister = async (rawQrValue: string) => {
    if (!selectedEventId) {
      toast.current?.show({
        severity: "warn",
        summary: "Evento requerido",
        detail: "Primero selecciona un evento.",
      });
      return;
    }

    const qrValue = rawQrValue.trim();
    if (!qrValue) {
      return;
    }

    const dedupeKey = `${selectedEventId}-${qrValue}`;
    if (lastProcessedScanRef.current === dedupeKey) {
      return;
    }

    lastProcessedScanRef.current = dedupeKey;

    try {
      const result = await registerAttendance({
        service_event_id: selectedEventId,
        qr_value: qrValue,
      });
      setResponse(result);
      setScanDialogVisible(false);
      toast.current?.show({
        severity: "success",
        summary: "Asistencia registrada",
        detail: result.message || "Registro completado.",
      });
    } catch {
      setResponse(null);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No fue posible registrar la asistencia.",
      });

      setTimeout(() => {
        lastProcessedScanRef.current = "";
      }, 800);
    }
  };

  const isLoading = loadingAction || loadingCatalogs;

  return (
    <MainLayout>
      <Toast ref={toast} position="top-right" baseZIndex={10000} />
      <section className="user-cards-page">
        <div className="user-cards-header">
          <h1 className="m-0">Registro de Asistencia</h1>
          <Button
            type="button"
            icon="pi pi-camera"
            label="Escanear Carnet"
            onClick={() => setScanDialogVisible(true)}
            className="p-button-secondary"
            disabled={!selectedEventId || isLoading}
          />
        </div>

        <Card className="user-cards-section mb-3">
          <div className="flex flex-column gap-3">
            <label htmlFor="attendance-event-id" className="font-medium">
              Evento
            </label>
            <Dropdown
              inputId="attendance-event-id"
              value={selectedEventId}
              options={eventOptions}
              onChange={(event: DropdownChangeEvent) =>
                setSelectedEventId(Number(event.value) || null)
              }
              placeholder="Selecciona un evento"
              filter
              showClear
              className="w-full"
            />

            <small className="text-700">
              Selecciona un evento y luego pulsa "Escanear Carnet". Al detectar
              el codigo se registra la asistencia automaticamente.
            </small>
          </div>
        </Card>

        {isLoading ? (
          <Card className="user-cards-section text-center mb-3">
            <ProgressSpinner style={{ width: "40px", height: "40px" }} />
            <p className="mt-2 mb-0">Registrando asistencia...</p>
          </Card>
        ) : null}

        {error ? (
          <Card className="user-cards-section mb-3">
            <p className="m-0 p-error">{error}</p>
          </Card>
        ) : null}

        {response ? (
          <Card className="user-cards-section" title="Resultado de /attendance">
            <div className="flex flex-column gap-2">
              <Tag
                value={
                  response.message ||
                  (response.success ? "Registro exitoso" : "Sin mensaje")
                }
                severity={response.success === false ? "danger" : "success"}
              />
              <pre className="m-0 text-xs overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </Card>
        ) : (
          !isLoading &&
          !error && (
            <Card className="user-cards-section">
              <p className="m-0 text-700">
                Selecciona un evento y escanea un carnet para ver el resultado.
              </p>
            </Card>
          )
        )}

        <Dialog
          header="Escanear QR"
          visible={scanDialogVisible}
          onHide={() => setScanDialogVisible(false)}
          breakpoints={{ "960px": "95vw" }}
          style={{ width: "500px", maxWidth: "95vw" }}
        >
          <QrScanner
            onScanSuccess={(value) => {
              void handleScanAndRegister(value);
            }}
            disabled={!selectedEventId || isLoading}
          />
        </Dialog>
      </section>
    </MainLayout>
  );
};
