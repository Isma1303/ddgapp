import { useCallback, useMemo, useState } from "react";
import type {
  CreateCardRequest,
  RegisterAttendanceRequest,
  RegisterAttendanceResponse,
  ScanQrRequest,
  ScanQrResponse,
  UserCard,
} from "../interfaces/user-card.interface";
import { UserCardsService } from "../services/user-cards.service";

export const useUserCards = () => {
  const service = useMemo(() => new UserCardsService(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAction = useCallback(async <T>(action: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      return await action();
    } catch (requestError: any) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Ocurrio un error inesperado";
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCardByUserId = useCallback(
    (userId: number | string): Promise<UserCard | null> =>
      runAction(() => service.getCardByUserId(userId)),
    [runAction, service],
  );

  const scanQr = useCallback(
    (payload: ScanQrRequest): Promise<ScanQrResponse> =>
      runAction(() => service.scanQr(payload)),
    [runAction, service],
  );

  const registerAttendance = useCallback(
    (payload: RegisterAttendanceRequest): Promise<RegisterAttendanceResponse> =>
      runAction(() => service.registerAttendance(payload)),
    [runAction, service],
  );

  const createCard = useCallback(
    (payload: CreateCardRequest): Promise<UserCard> =>
      runAction(() => service.createCard(payload)),
    [runAction, service],
  );

  const getAllCards = useCallback(
    (): Promise<UserCard[]> => runAction(() => service.getAllCards()),
    [runAction, service],
  );

  return {
    loading,
    error,
    getCardByUserId,
    scanQr,
    registerAttendance,
    createCard,
    getAllCards,
    clearError: () => setError(null),
  };
};
