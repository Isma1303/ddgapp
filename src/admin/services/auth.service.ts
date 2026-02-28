import { ParentService } from "../../system/service";
import type { IUserNew, IUserProfile } from "../interfaces/user.interface";

export class AuthService extends ParentService {
    constructor() {
        super("/admin/auth")
    }

    async getAll() {
        const response = await this.axiosInstance.get("/");
        return response.data;
    }

    async update(user_id: number, data: IUserNew) {
        const response = await this.axiosInstance.put(`/${user_id}`, data);
        return response.data;
    }

    async login(email: string, password: string) {
        const response = await this.axiosInstance.post("/login", { email, password });
        return response.data;
    }

    async register(data: IUserNew) {
        const response = await this.axiosInstance.post("/register", data)
        return response.data;
    }

    async profile(user_id: number): Promise<IUserProfile> {
        const response = await this.axiosInstance.get(`/profile/${user_id}`);
        return response.data;
    }

    async changePassword(user_id: number, password: string) {
        const response = await this.axiosInstance.put(`/change-password/${user_id}`, { password });
        return response.data;
    }

    async logout() {
        const response = await this.axiosInstance.post("/logout");
        return response.data;
    }

    async deleteUser(user_id: number) {
        const response = await this.axiosInstance.delete(`/delete-user/${user_id}`);
        return response.data;
    }
}