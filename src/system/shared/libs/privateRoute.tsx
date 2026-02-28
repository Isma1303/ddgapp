import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { isTokenExpired } from "../services/token.service";

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    if (!token || isTokenExpired(token)) {
        if (token && isTokenExpired(token)) {
            logout();
        }

        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};