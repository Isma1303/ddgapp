import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { AuthService } from "../../../admin/services/auth.service";

export const useAuth = () => {
    const navigate = useNavigate();
    const logoutStore = useAuthStore((state) => state.logout);
    const authService = new AuthService();

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Error al cerrar sesión en el servidor:", error);
        } finally {
            logoutStore();
            navigate("/");
        }
    };

    return {
        logout,
        user: useAuthStore((state) => state.user),
        isAuthenticated: useAuthStore((state) => state.isAuthenticated())
    };
};
