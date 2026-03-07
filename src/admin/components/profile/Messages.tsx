import { MainLayout } from "../../../ddg/components/Layout/MainLayout";
import "./Profile.css";

export const Messages = () => {
  return (
    <MainLayout>
      <div className="profile-page-header mb-4">
        <h1 className="m-0 app-page-title">Mensajes</h1>
        <p className="app-page-subtitle">
          Revisa y gestiona tu bandeja de entrada interna.
        </p>
      </div>
      <div className="profile-message-card p-4">
        <p>Bandeja de entrada de mensajes.</p>
      </div>
    </MainLayout>
  );
};
