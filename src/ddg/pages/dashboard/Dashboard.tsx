import { useAuth } from "../../../system/shared/hooks/useAuth";
import { useAuthStore } from "../../../system/shared/store/authStore";
import { MainLayout } from "../../components/Layout/MainLayout";
import { Events } from "../../components/events/Events";

export const Dashboard = () => {
  const { user } = useAuth();
  const role = useAuthStore((state) => state.user?.role_cd ?? null);

  return (
    <>
      {role === "ADMIN" || role === "LEADER" ? (
        <MainLayout>
          <div className="flex justify-content-between align-items-center mb-4">
            <h1 className="m-0">Dashboard</h1>
            <div className="flex align-items-center gap-3">
              <span>
                Bienvenido, <strong>{user?.user_id || "Usuario"}</strong>
              </span>
            </div>
          </div>

          <div className="surface-card p-4 shadow-2 border-round">
            <p>Contenido protegido del dashboard.</p>
          </div>
        </MainLayout>
      ) : role === "USER" ? (
        <Events />
      ) : (
        <div>No tienes permisos para ver el dashboard.</div>
      )}
    </>
  );
};
