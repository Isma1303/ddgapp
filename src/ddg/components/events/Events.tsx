import { useState, useMemo, useEffect } from "react";
import { MainLayout } from "../Layout/MainLayout";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Dialog } from "primereact/dialog";
import { useScreenService } from "../../../system/shared/services/screen.service";
import { useEvents } from "../../hooks/useEvents";
import { useAuthStore } from "../../../system/shared/store/authStore";
import { getTokenUserId } from "../../../system/shared/services/token.service";

const localizer = dayjsLocalizer(dayjs);
export const Events = () => {
    const { loadUserEvents } = useEvents();
    const [allEvents, setAllEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const token = useAuthStore((state) => state.token);
    const [view, setView] = useState<any>(Views.WEEK);
    const [date, setDate] = useState(new Date());
    const { sizes } = useScreenService();

    const isMobile = sizes["screen-x-small"] || sizes["screen-small"];
    const selectedView = view;
    const calendarView = isMobile && selectedView === Views.WEEK ? Views.AGENDA : selectedView;

    useEffect(() => {
        const loadEvents = async () => {
            const userId = getTokenUserId(token);
            if (!userId) {
                setAllEvents([]);
                return;
            }

            const userEvents = await loadUserEvents(userId);
            setAllEvents(Array.isArray(userEvents) ? userEvents : []);
        };

        loadEvents();
    }, [loadUserEvents, token]);

    const filteredEvents = useMemo(() => {
        return allEvents.map((event: any) => {
            const eventDate = dayjs(event.service_date);
            return {
                ...event,
                title: event.service_nm,
                start: dayjs(`${eventDate.format('YYYY-MM-DD')} ${event.start_time}`).toDate(),
                end: dayjs(`${eventDate.format('YYYY-MM-DD')} ${event.end_time}`).toDate(),
            };
        });
    }, [allEvents]);

    const viewOptions = [
        { label: 'Día', value: Views.DAY },
        { label: 'Semana', value: Views.WEEK },
        { label: 'Mes', value: Views.MONTH }
    ];

    const eventPropGetter = () => {
        return {
            style: {
                backgroundColor: '#dbeafe',
                borderLeft: '4px solid #0078d4',
                color: '#004a87',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '600',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                padding: '4px 8px',
            }
        };
    };

    return (
        <MainLayout>
            <div className="flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
                <div className="flex align-items-center gap-2">
                    <i className="pi pi-calendar text-primary-500 text-2xl"></i>
                    <h1 className="m-0 text-xl font-semibold text-800">Calendario</h1>
                </div>
            </div>

            <div className="surface-card shadow-1 border-round-xl overflow-hidden" style={{ border: '1px solid #e0e0e0' }}>
                <div className="flex flex-column md:flex-row md:align-items-center justify-content-between p-3 bg-white border-bottom-1 surface-border gap-3">
                    <div className="flex align-items-center gap-1 flex-wrap">
                        <Button
                            icon="pi pi-chevron-left"
                            onClick={() => setDate(dayjs(date).subtract(1, selectedView === Views.DAY ? 'day' : selectedView === Views.WEEK ? 'week' : 'month').toDate())}
                            className="p-button-text p-button-secondary p-button-sm p-button-rounded"
                        />
                        <Button
                            icon="pi pi-chevron-right"
                            onClick={() => setDate(dayjs(date).add(1, selectedView === Views.DAY ? 'day' : selectedView === Views.WEEK ? 'week' : 'month').toDate())}
                            className="p-button-text p-button-secondary p-button-sm p-button-rounded"
                        />
                        <Button
                            label="Hoy"
                            onClick={() => setDate(new Date())}
                            className="p-button-text p-button-secondary p-button-sm font-medium ml-2"
                        />
                        <h2 className="m-0 text-base md:text-lg font-medium text-800 ml-0 md:ml-3 mt-2 md:mt-0">
                            {selectedView === Views.DAY ? dayjs(date).format('DD [de] MMMM, YYYY') :
                                selectedView === Views.WEEK ? `${dayjs(date).startOf('week').format('DD MMM')} - ${dayjs(date).endOf('week').format('DD MMM, YYYY')}` :
                                    dayjs(date).format('MMMM YYYY')}
                        </h2>
                    </div>

                    <div className="flex align-items-center w-full md:w-auto">
                        <SelectButton
                            value={selectedView}
                            options={viewOptions}
                            onChange={(e) => e.value && setView(e.value)}
                            className="p-selectbutton-sm w-full calendar-view-toggle"
                        />
                    </div>
                </div>

                <div style={{ height: isMobile ? '60vh' : '70vh', padding: '10px' }}>
                    <style>
                        {`
                            /* Estilos para forzar el look DevExpress Blue Light en React Big Calendar */
                            .rbc-calendar {
                                font-family: inherit;
                            }
                            .rbc-header {
                                padding: 10px 0 !important;
                                font-weight: 500 !important;
                                color: #666 !important;
                                border-bottom: 2px solid #f0f0f0 !important;
                            }
                            .rbc-time-header-content {
                                border-left: 1px solid #f0f0f0 !important;
                            }
                            .rbc-timeslot-group {
                                border-bottom: 1px solid #f8f8f8 !important;
                                min-height: 60px !important;
                            }
                            .rbc-time-slot {
                                border-top: 1px solid #fcfcfc !important;
                            }
                            .rbc-time-view {
                                border: none !important;
                            }
                            .rbc-day-slot .rbc-event {
                                border: none !important;
                                box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                            }
                            .rbc-event-label {
                                font-size: 11px !important;
                                margin-bottom: 2px !important;
                                opacity: 0.8 !important;
                            }
                            .rbc-event-content {
                                font-size: 13px !important;
                            }
                            .rbc-current-time-indicator {
                                background-color: #0078d4 !important;
                            }
                            .rbc-today {
                                background-color: #f8fbff !important;
                            }
                            .rbc-label {
                                color: #999 !important;
                                font-size: 12px !important;
                                padding-right: 10px !important;
                            }
                            .calendar-view-toggle .p-button {
                                padding: 0.45rem 0.8rem !important;
                                font-size: 0.9rem !important;
                            }
                            @media (max-width: 768px) {
                                .calendar-view-toggle .p-button {
                                    flex: 1 1 33.33%;
                                    padding: 0.4rem 0.5rem !important;
                                    font-size: 0.85rem !important;
                                }
                            }
                        `}
                    </style>
                    <Calendar
                        localizer={localizer}
                        events={filteredEvents}
                        startAccessor="start"
                        endAccessor="end"
                        views={isMobile ? [Views.DAY, Views.AGENDA, Views.MONTH] : [Views.DAY, Views.WEEK, Views.MONTH]}
                        min={dayjs().hour(5).minute(0).second(0).millisecond(0).toDate()}
                        max={dayjs().hour(22).minute(0).second(0).millisecond(0).toDate()}
                        view={calendarView}
                        onView={(v) => {
                            if (isMobile && v === Views.AGENDA) {
                                setView(Views.WEEK);
                                return;
                            }

                            setView(v);
                        }}
                        date={date}
                        onNavigate={(d) => setDate(d)}
                        onSelectEvent={(event) => {
                            setSelectedEvent(event);
                            setIsEventDialogOpen(true);
                        }}
                        eventPropGetter={eventPropGetter}
                        toolbar={false}
                        messages={{
                            next: "Siguiente",
                            previous: "Anterior",
                            today: "Hoy",
                            month: "Mes",
                            week: "Semana",
                            day: "Día",
                            agenda: "Semana",
                            date: "Fecha",
                            time: "Horario",
                            event: "Evento"
                        }}
                    />
                </div>
            </div>

            <Dialog
                header="Detalle del evento"
                visible={isEventDialogOpen}
                style={{ width: isMobile ? "92vw" : "32rem" }}
                onHide={() => {
                    setIsEventDialogOpen(false);
                    setSelectedEvent(null);
                }}
            >
                {selectedEvent && (
                    <div className="flex flex-column gap-3">
                        <div>
                            <div className="text-500 text-sm mb-1">Evento</div>
                            <div className="text-900 font-medium">{selectedEvent.title}</div>
                        </div>
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <div className="text-500 text-sm mb-1">Fecha</div>
                                <div className="text-900">{dayjs(selectedEvent.start).format('DD/MM/YYYY')}</div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="text-500 text-sm mb-1">Horario</div>
                                <div className="text-900">
                                    {dayjs(selectedEvent.start).format('hh:mm A')} - {dayjs(selectedEvent.end).format('hh:mm A')}
                                </div>
                            </div>
                        </div>
                        {selectedEvent.service_event_id && (
                            <div>
                                <div className="text-500 text-sm mb-1">ID</div>
                                <div className="text-900">{selectedEvent.service_event_id}</div>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </MainLayout>
    );
};
