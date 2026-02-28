import { AuthService } from "../../../admin/services/auth.service";
import {create} from "zustand";
import { useAuthStore } from "../store/authStore";

interface JwtPayload {
    exp?: number;
    user_id?: number | string;
    sub?: number | string;
    [key: string]: unknown;
}

const decodeBase64Url = (value: string): string => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return atob(padded);
};

export const getTokenPayload = (token: string | null): JwtPayload | null => {
    if (!token) {
        return null;
    }

    try {
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
            return null;
        }

        const decodedPayload = decodeBase64Url(tokenParts[1]);
        return JSON.parse(decodedPayload) as JwtPayload;
    } catch (error) {
        return null;
    }
};

export const getTokenUserId = (token: string | null): number | null => {
    const payload = getTokenPayload(token);
    if (!payload) {
        return null;
    }

    const candidate = payload.user_id ?? payload.sub;
    if (typeof candidate === "number") {
        return candidate;
    }

    if (typeof candidate === "string") {
        const parsed = Number(candidate);
        return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
};

export const isTokenExpired = (token: string | null): boolean => {
    const payload = getTokenPayload(token);
    if (!payload || typeof payload.exp !== "number") {
        return true;
    }

    const currentEpochSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= currentEpochSeconds;
};

export const setUserRoles = async (token: string)=>{
    const userService = new AuthService();  
    try {
        const userId = getTokenUserId(token);
        if (!userId) {
            return null;
        }

        const user: any = await userService.profile(userId);
        
        useAuthStore.setState({
            user: {
                user_id: userId,
                role_cd: user.data.role_cd || null,
            },
        });

        return user.data.role_cd || null;
    } catch (error) {
        return null;
    }
}
