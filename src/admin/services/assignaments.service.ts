import { ParentService } from "../../system/service";
import type { IUserAssignament } from "../interfaces/assignament.interface";

export class AssignamentsService extends ParentService {
    constructor() {
        super('/admin/assignament');
    }

    async getAll() {
        const response = await this.axiosInstance.get("/");
        return response.data;
    }
    async update(id: number, data: any) {
        const response = await this.axiosInstance.put(`/${id}`, data);
        return response.data;
    }
    async create(data: any) {
        const response = await this.axiosInstance.post("/", data);
        return response.data;
    }
    async deleteAssignment(user_id: number, role_id: number) {
        const response = await this.axiosInstance.delete("/", { data: { user_id, role_id } });
        return response.data;
    }

    async assign(data: IUserAssignament) {
        const response = await this.axiosInstance.post(`/assign`, data);
        return response.data;
    }

    async getAssign() {
        try {
            const response = await this.axiosInstance.get('/assign');
            return response.data;
        } catch {
            const fallbackResponse = await this.axiosInstance.get('/assing');
            return fallbackResponse.data;
        }
    }
}