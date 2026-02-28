import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

interface HeaderProps {
    onToggleSidebar: () => void;
    isMobile?: boolean;
}

export const Header = ({ onToggleSidebar, isMobile = false }: HeaderProps) => {
    return (
        <header className="flex align-items-center justify-content-between px-3 md:px-4 py-2 surface-card shadow-1 z-5">
            <div className="flex align-items-center gap-3">
                <Button
                    icon="pi pi-bars"
                    rounded
                    text
                    severity="secondary"
                    onClick={onToggleSidebar}
                    aria-label="Toggle Sidebar"
                />
                <Link to="/dashboard" className="logo flex align-items-center">
                    <img src="/ddg_logo.jpg" alt="Logo" style={{ height: isMobile ? '32px' : '40px' }} />
                </Link>
            </div>
        </header>
    )
}