import { useEffect } from "react";
import { useAuth } from "../../../system/shared/hooks/useAuth";
import { useAuthStore } from "../../../system/shared/store/authStore";
import { MainLayout } from "../../components/Layout/MainLayout";
import { Events } from "../../components/events/Events";
import { useDashboard } from "../../hooks/useDashboard";

export const Dashboard = () => {
  const { data } = useDashboard();
  const { user } = useAuth();
  const role = useAuthStore((state) => state.user?.role_cd ?? null);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      {role === "ADMIN" || role === "LEADER" ? (
        <MainLayout>
          <div className="flex justify-content-between align-items-center mb-4">
            <h1 className="m-0">Panel principal</h1>
            <div className="flex align-items-center gap-3">
              <span>
                Bienvenido, <strong>{user?.user_id || "Usuario"}</strong>
              </span>
            </div>
          </div>

          <div className="app-section-card p-4">
            <p>Contenido protegido del panel principal.</p>
          </div>
        </MainLayout>
      ) : role === "USER" ? (
        <Events />
      ) : (
        <div></div>
      )}
    </>
  );
};
