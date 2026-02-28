import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../system/shared/store/authStore";
import { setUserRoles } from "../../system/shared/services/token.service";

export const useLoginForm = () => {
    const authService = new AuthService();
    const setAuth = useAuthStore((state) => state.setAuth);
    const logoutStore = useAuthStore((state) => state.logout);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await authService.login(email, password);
            const authData = response?.data;

            if (authData?.token) {
                const token = authData.token as string;

                setAuth(token);

                await setUserRoles(token);

                navigate('/dashboard');
            }

            return response;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        try {
            authService.logout();
            logoutStore();
            navigate('/');
        } catch (error) {
            throw error;
        }
    }

    return {
        login,
        logout,
        loading
    };
}