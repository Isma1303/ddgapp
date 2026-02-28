
import { PanelMenu } from 'primereact/panelmenu';
import { Badge } from 'primereact/badge';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../system/shared/hooks/useAuth';
import { AuthService } from '../../../admin/services/auth.service';
import { getTokenUserId } from '../../../system/shared/services/token.service';
import { useAuthStore } from '../../../system/shared/store/authStore';
import { useEffect, useState } from 'react';


interface SidebarProps {
    collapsed: boolean;
    onNavigate?: () => void;
}

export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
    const userService = new AuthService();
    const token = useAuthStore((state) => state.token);
    const userId = getTokenUserId(token);
    const [role, setRole] = useState<string | null>(null);

    const navigate = useNavigate();
    const { logout } = useAuth();

    const childItemRenderer = (item: any) => (
        <a
            className={classNames("flex align-items-center p-menuitem-link cursor-pointer text-700", { "justify-content-center px-0": collapsed })}
            onClick={() => {
                if (item.command) {
                    item.command();
                } else if (item.url) {
                    navigate(item.url);
                }
                if (onNavigate) onNavigate();
            }}
        >
            <span className={classNames(item.icon, { "text-xl": collapsed })} />
            {!collapsed && <span className="mx-2">{item.label}</span>}
            {!collapsed && item.badge && <Badge className="ml-auto" value={item.badge} />}
            {!collapsed && item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );


    useEffect(() => {
        const getUserRole = async () => {
            try {
                const data: any = await userService.profile(Number(userId));
                setRole(data.data.role_cd || 'USER');
            } catch (error) {
                setRole(null);
            }
        };
        getUserRole();
    }, [userId]);

    const allItems: any[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            url: '/dashboard',
            template: childItemRenderer
        },
        {
            label: 'Administracion',
            icon: 'pi pi-sliders-h',
            items: [
                { label: 'Usuarios', icon: 'pi pi-user', url: '/users', template: childItemRenderer },
                { label: 'Roles', icon: 'pi pi-sliders-h', url: '/roles', template: childItemRenderer },
                { label: 'Asignaciones', icon: 'pi pi-arrow-right-arrow-left', url: '/assignaments', template: childItemRenderer }
            ]
        },
        {
            label: 'Eventos',
            icon: 'pi pi-calendar',
            items: [
                { label: 'Administrar Eventos', icon: 'pi pi-address-book', url: '/events/new', template: childItemRenderer },
                { label: 'Eventos', icon: 'pi pi-calendar', url: '/events', template: childItemRenderer },
            ]
        },
        {
            label: 'Configuración',
            icon: 'pi pi-cog',
            items: [
                { label: 'Perfil', icon: 'pi pi-user', url: '/profile/settings', template: childItemRenderer },
                {
                    label: 'Cerrar Sesión',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        logout();
                    },
                    template: childItemRenderer
                }
            ]
        },
    ];

    if (!role) {
        return <div className="h-full surface-section overflow-y-auto w-full flex items-center justify-center">Cargando menú...</div>;
    }
    let items: any[] = [];
    if (role === 'ADMIN' || role === 'LEADER') {
        items = allItems;
    } else if (role === 'USER') {
        items = allItems.filter(item =>
            item.label === 'Eventos' || item.label === 'Configuración'
        );
    } else {
        return <div className="h-full surface-section overflow-y-auto w-full flex items-center justify-center">No tienes permisos para ver el menú.</div>;
    }

    return (
        <div className="h-full surface-section overflow-y-auto w-full">
            <PanelMenu model={items} className={classNames("w-full border-none", { "collapsed-menu": collapsed })} style={{ width: '100%' }} multiple={false} />
            <style>{`
                .p-panelmenu .p-panelmenu-header .p-menuitem-link,
                .p-panelmenu .p-panelmenu-content .p-menuitem-link {
                    padding: 0.75rem 1rem;
                    color: var(--text-color);
                    text-decoration: none;
                }
                .p-panelmenu .p-panelmenu-panel {
                    border: none;
                    background: transparent;
                    margin-bottom: 0;
                }
                .collapsed-menu .p-panelmenu-icon {
                    display: none !important;
                }
                .collapsed-menu .p-panelmenu-header .p-menuitem-link {
                    justify-content: center !important;
                    padding: 0.75rem 0 !important;
                }
                .collapsed-menu .p-menuitem-icon {
                    margin-right: 0 !important;
                    font-size: 1.5rem;
                }
                .collapsed-menu .p-panelmenu-content {
                    display: none !important; 
                }
            `}</style>
        </div>
    );
}
