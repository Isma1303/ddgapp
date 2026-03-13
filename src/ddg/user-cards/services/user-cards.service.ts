import { ParentService } from "../../../system/service";
import type {
  CreateCardRequest,
  RegisterAttendanceRequest,
  RegisterAttendanceResponse,
  ScanQrRequest,
  ScanQrResponse,
  UserCard,
} from "../interfaces/user-card.interface";

interface ApiEnvelope<T> {
  status?: number;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

const unwrapResponse = <T>(payload: T | ApiEnvelope<T>): T => {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as ApiEnvelope<T>).data !== undefined
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
};

export class UserCardsService extends ParentService {
  constructor() {
    super("/ddg/user-cards");
  }

  async getCardByUserId(user_id: number | string): Promise<UserCard | null> {
    const response = await this.get<UserCard | ApiEnvelope<UserCard>>(
      `/user/${user_id}`,
    );
    const card = unwrapResponse(response);
    return card ?? null;
  }

  async scanQr(payload: ScanQrRequest): Promise<ScanQrResponse> {
    const response = await this.axiosInstance.post<
      ScanQrResponse | ApiEnvelope<ScanQrResponse>
    >("/scan", payload);

    return unwrapResponse(response.data);
  }

  async registerAttendance(
    payload: RegisterAttendanceRequest,
  ): Promise<RegisterAttendanceResponse> {
    const response = await this.axiosInstance.post<
      RegisterAttendanceResponse | ApiEnvelope<RegisterAttendanceResponse>
    >("/attendance", payload);

    return unwrapResponse(response.data);
  }

  async createCard(payload: CreateCardRequest): Promise<UserCard> {
    const response = await this.post<UserCard | ApiEnvelope<UserCard>>(payload);
    return unwrapResponse(response);
  }

  async getAllCards(): Promise<UserCard[]> {
    const response = await this.axiosInstance.get<
      UserCard[] | ApiEnvelope<UserCard[]>
    >("/");
    const payload = response.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === "object" && "data" in payload) {
      const wrapped = (payload as ApiEnvelope<UserCard[]>).data;
      return Array.isArray(wrapped) ? wrapped : [];
    }

    return [];
  }
}
