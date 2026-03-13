export interface UserCard {
  user_card_id?: number;
  user_id?: number | string;
  user_nm?: string;
  full_name?: string;
  card_status?: string;
  is_active?: boolean;
  qr_value?: string;
  qr_image_url?: string;
  qr_image_base64?: string;
  qr_image?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ScanQrRequest {
  qr_value: string;
  service_event_id?: number | string;
}

export interface ScanQrResponse {
  success?: boolean;
  message?: string;
  qr_value?: string;
  user_card?: UserCard;
  [key: string]: unknown;
}

export interface RegisterAttendanceRequest {
  service_event_id: number | string;
  qr_value: string;
}

export interface RegisterAttendanceResponse {
  success?: boolean;
  message?: string;
  attendance_id?: number;
  service_event_id?: number | string;
  [key: string]: unknown;
}

export interface CreateCardRequest {
  user_id: number | string;
  card_status?: string;
  is_active?: boolean;
  [key: string]: unknown;
}
