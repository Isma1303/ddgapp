import { useCallback, useMemo, useState } from "react";
import { AuthService } from "../../../admin/services/auth.service";
import type { IUserCardInfo } from "../../../admin/interfaces/user.interface";
import { EventService } from "../../services/events.service";
import type { IEvent } from "../../interfaces/event.interface";

export const useUserCardCatalogs = () => {
  const authService = useMemo(() => new AuthService(), []);
  const eventService = useMemo(() => new EventService(), []);
  const [loading, setLoading] = useState(false);

  const loadUsers = useCallback(async (): Promise<IUserCardInfo[]> => {
    setLoading(true);
    try {
      const response: any = await authService.usersInfo();
      if (Array.isArray(response)) {
        return response;
      }
      if (response?.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, [authService]);

  const loadEvents = useCallback(async (): Promise<IEvent[]> => {
    setLoading(true);
    try {
      const response: any = await eventService.getEvent();
      if (Array.isArray(response)) {
        return response;
      }
      if (response?.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [eventService]);

  return {
    loading,
    loadUsers,
    loadEvents,
  };
};
