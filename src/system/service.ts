import axios, { type AxiosInstance } from "axios";
import { configuration } from "./config";
import { useAuthStore } from "./shared/store/authStore";
import { isTokenExpired } from "./shared/services/token.service";

export class ParentService {
    protected axiosInstance: AxiosInstance;
    protected base_url: string;
    constructor(url: string) {
        this.base_url = url;
        this.axiosInstance = axios.create({
            baseURL: configuration.apiURL + url,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                const { token, logout } = useAuthStore.getState();

                if (token && isTokenExpired(token)) {
                    logout();
                    window.location.href = "/";
                    return Promise.reject(new axios.Cancel("Token expired"));
                }

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    useAuthStore.getState().logout();
                    window.location.href = "/";
                }
                return Promise.reject(error);
            }
        );
    }


    public async getAll<T>(): Promise<T[]> {
        const response = await this.axiosInstance.get<T[]>(this.base_url);
        return response.data;
    }

    public async getById<T>(id: number): Promise<T> {
        const response = await this.axiosInstance.get<T>(`${this.base_url}/${id}`);
        return response.data;
    }

    public async get<T>(url: string): Promise<T> {
        const response = await this.axiosInstance.get<T>(url);
        return response.data;
    }

    public async post<T>(data: any): Promise<T> {
        const response = await this.axiosInstance.post<T>(this.base_url, data);
        return response.data;
    }

    public async put<T>(user_id: number, data: any): Promise<T> {
        const response = await this.axiosInstance.put<T>(this.base_url, { user_id, ...data });
        return response.data;
    }

    public async delete<T>(user_id: number): Promise<T> {
        const response = await this.axiosInstance.delete<T>(this.base_url, { data: { user_id } });
        return response.data;
    }
}