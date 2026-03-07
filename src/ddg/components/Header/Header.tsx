import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar: () => void;
  isMobile?: boolean;
}

export const Header = ({ onToggleSidebar, isMobile = false }: HeaderProps) => {
  const { pathname } = useLocation();

  const pageDictionary: Record<string, { title: string; subtitle: string }> = {
    "/dashboard": {
      title: "Panel principal",
      subtitle: "Resumen general de la operacion diaria",
    },
    "/events": {
      title: "Eventos",
      subtitle: "Calendario y gestion de actividades",
    },
    "/events/new": {
      title: "Gestion de eventos",
      subtitle: "Administra y publica nuevos eventos",
    },
    "/users": {
      title: "Usuarios",
      subtitle: "Control de accesos y cuentas activas",
    },
    "/roles": {
      title: "Roles",
      subtitle: "Permisos y perfiles organizacionales",
    },
    "/assignaments": {
      title: "Asignaciones",
      subtitle: "Vinculacion entre usuarios y departamentos",
    },
    "/profile/settings": {
      title: "Configuracion de perfil",
      subtitle: "Preferencias y datos personales",
    },
    "/profile/messages": {
      title: "Mensajes",
      subtitle: "Comunicacion y notificaciones internas",
    },
  };

  const activePage = pageDictionary[pathname] ?? {
    title: "DDG App",
    subtitle: "Plataforma corporativa",
  };

  return (
    <header className="app-header flex align-items-center justify-content-between px-3 md:px-4 py-2 z-5">
      <div className="flex align-items-center gap-3">
        <Button
          icon="pi pi-bars"
          rounded
          text
          severity="secondary"
          onClick={onToggleSidebar}
          aria-label="Abrir navegacion"
        />
        <Link to="/dashboard" className="logo flex align-items-center">
          <img
            src="/ddg_logo.jpg"
            alt="Logo DDG"
            style={{ height: isMobile ? "32px" : "40px" }}
          />
        </Link>
        {!isMobile && (
          <div className="app-header__titles">
            <h1 className="app-page-title">{activePage.title}</h1>
            <p className="app-page-subtitle">{activePage.subtitle}</p>
          </div>
        )}
      </div>

      <div className="app-header__status hidden md:flex align-items-center gap-2">
        <i
          className="pi pi-circle-fill app-header__status-dot"
          aria-hidden="true"
        />
        <span>Operacion activa</span>
      </div>
    </header>
  );
};
