import type { IConfiguration } from "./shared/interface/config.interface";

export const configuration: IConfiguration = {
    apiURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
}