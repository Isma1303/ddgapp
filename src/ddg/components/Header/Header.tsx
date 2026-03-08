import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar: () => void;
  isMobile?: boolean;
}

export const Header = ({ onToggleSidebar, isMobile = false }: HeaderProps) => {
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
