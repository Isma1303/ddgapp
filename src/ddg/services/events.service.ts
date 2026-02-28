import { ParentService } from "../../system/service";

export class EventService extends ParentService {
  constructor() {
    super("/ddg/events");
  }

  async getEvent() {
    try {
      const response = await this.axiosInstance.get(`/`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async createEvent(event: any) {
    try {
      const response = await this.axiosInstance.post("/", { event });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async updateEvent(event_id: number, event: any) {
    try {
      const response = await this.axiosInstance.put(`/${event_id}`, event);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteEvent(event_id: number) {
    try {
      const response = await this.axiosInstance.delete(`/${event_id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async sendReminder(event_id: number) {
    try {
      const response = await this.axiosInstance.post(`/reminder/${event_id}`);
      return response.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async assignUserToEvent(event_id: number, user_id: number) {
    try {
      const response = await this.axiosInstance.post(
        `/assign-user/${event_id}`,
        { user_id },
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async getEventById(event_id: number) {
    try {
      const response = await this.axiosInstance.get(`/${event_id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async getUsersbyEvent(event_id: number) {
    try {
      const response = await this.axiosInstance.get(`/users/${event_id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async getEventsByUserId(user_id: number) {
    try {
      const response = await this.axiosInstance.get(`/user-events/${user_id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserFromEvent(event_id: number, user_id: number) {
    try {
      const response = await this.axiosInstance.delete(`/deleteUserFromEvent/${event_id}/${user_id}` );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async attendance(event_id: number, user_id: number) { 
    try {
      const response = await this.axiosInstance.post(`/attendance`, { event_id, user_id });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

}
