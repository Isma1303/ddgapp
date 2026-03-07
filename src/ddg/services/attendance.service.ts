import { ParentService } from "../../system/service";

export class AttendanceService extends ParentService {
  constructor() {
    super("/ddg/attendance");
  }

  public async create(
    user_id: number,
    service_event_id: number,
    attendance_status_id: number,
  ) {
    try {
      const response = await this.axiosInstance.post("/", {
        user_id,
        service_event_id,
        attendance_status_id,
      });
      return response.data;
    } catch (error) {
      console.log("Error createing attendance", error);
    }
  }

  public async update(
    user_id: number,
    service_event_id: number,
    attendance_status_id: number,
    notes?: string,
  ) {
    try {
      const response = await this.axiosInstance.put(`/${user_id}`, {
        service_event_id,
        attendance_status_id,
        notes,
      });
      return response.data;
    } catch (error) {
      console.log("Error updating attendance", error);
    }
  }
}
