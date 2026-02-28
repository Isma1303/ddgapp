import { useCallback, useState } from "react";
import { AuthService } from "../../admin/services/auth.service";
import { EventService } from "../services/events.service";
import type {
  IEvent,
  IEventNew,
  IEventsAssignaments,
  IEventUpdate,
} from "../interfaces/event.interface";
import { AssignamentsService } from "../../admin/services/assignaments.service";

export const useEvents = () => {
  const assignamentService = new AssignamentsService();
  const eventService = new EventService();
  const authService = new AuthService();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);

  const getUnassignedUsers = async (event_id: number) => {
    setLoading(true);
    try {
      let allUsers = await authService.getAll();
      if (allUsers && typeof allUsers === "object" && Array.isArray(allUsers.data)) {
        allUsers = allUsers.data;
      }
      let assignedUsers = await eventService.getUsersbyEvent(event_id);
      if (assignedUsers && typeof assignedUsers === "object" && Array.isArray(assignedUsers.data)) {
        assignedUsers = assignedUsers.data;
      }
      const assignedIds = Array.isArray(assignedUsers)
        ? assignedUsers.map((u: any) => u.user_id)
        : [];
      const unassigned = Array.isArray(allUsers)
        ? allUsers.filter((u: any) => !assignedIds.includes(u.user_id))
        : [];
      return unassigned;
    } finally {
      setLoading(false);
    }
  };

  const getEvents = async () => {
    setLoading(true);
    const response: any = await eventService.getEvent();
    if (response && response.data) {
      setEvents(response.data);
    }
    setLoading(false);
  };

  const createEvent = async (event: IEventNew) => {
    setLoading(true);
    await eventService.createEvent(event);
    await getEvents();
    setLoading(false);
  };

  const updateEvent = async (event_id: number, event: IEventUpdate) => {
    setLoading(true);
    await eventService.updateEvent(event_id, event);
    await getEvents();
    setLoading(false);
  };

  const deleteEvent = async (event_id: number) => {
    setLoading(true);
    await eventService.deleteEvent(event_id);
    await getEvents();
    setLoading(false);
  };

  const asign = async (data: IEventsAssignaments) => {
    setLoading(true);
    await assignamentService.assign(data as any);
    setLoading(false);
  };

  const sendReminder = async (event_id: number) => {
    try {
      await eventService.sendReminder(event_id);
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  };

  const assignUserToEvent = async (event_id: number, user_id: number) => {
    setLoading(true);
    await eventService.assignUserToEvent(event_id, user_id);
    setLoading(false);
  }

  const loadEventDetail = async (event_id: number) => {
    setLoading(true);
    const response: any = await eventService.getEventById(Number(event_id));
    setLoading(false);
    return response.data;
  }

  const getUsersbyEvent = async (event_id: number) => {
    setLoading(true);
    const response: any = await eventService.getUsersbyEvent(event_id);
    setLoading(false);
    return response.data;
  }

  const loadUserEvents = useCallback(async (user_id: number) => {
    try {
      setLoading(true);
      const response: any = await eventService.getEventsByUserId(user_id);
      setLoading(false);
      return response?.data ?? response ?? [];
    } catch (error) {
      setLoading(false);
      return [];
    }
  }, []);

  return {
    loading,
    events,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    asign,
    sendReminder,
    assignUserToEvent,
    loadEventDetail,
    getUsersbyEvent,
    loadUserEvents
    ,getUnassignedUsers
  };
};
