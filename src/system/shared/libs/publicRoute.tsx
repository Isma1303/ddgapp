import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { isTokenExpired } from "../services/token.service";

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    if (token && isTokenExpired(token)) {
        logout();
        return <>{children}</>;
    }

    if (token && !isTokenExpired(token)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
