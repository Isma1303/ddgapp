export interface IEvent {
    service_event_id: number;
    service_nm: string;
    service_date: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    department_id: number
    department_nm?: string
}

export interface IEventNew extends Omit<IEvent, 'service_event_id'> { }
export interface IEventUpdate extends Partial<IEvent> { }

export interface IEventsAssignaments {
    department_id: number;
    user_id: number;
    is_leader: boolean;
}