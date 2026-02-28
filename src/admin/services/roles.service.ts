import { ParentService } from "../../system/service";
import type { IRoleNew, IRoleUpdate } from "../interfaces/role.interface";

export class RolesService extends ParentService {
    constructor() {
        super('/admin/role');
    }
    async getAll() {
        const response = await this.axiosInstance.get("/");
        return response.data;
    }
    async update(role_id: number, data: IRoleUpdate) {
        const response = await this.axiosInstance.put(`/${role_id}`, data);
        return response.data;
    }
    async create(data: IRoleNew) {
        const response = await this.axiosInstance.post("/", data);
        return response.data;
    }
    async delete(role_id: number) {
        const response = await this.axiosInstance.delete(`/${role_id}`);
        return response.data;
    }
} 