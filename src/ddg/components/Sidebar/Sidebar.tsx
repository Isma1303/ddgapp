import { PanelMenu } from "primereact/panelmenu";
import { Badge } from "primereact/badge";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../system/shared/hooks/useAuth";
import { useAuthStore } from "../../../system/shared/store/authStore";
import "./Sidebar.css";
interface SidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const role = useAuthStore((state) => state.user?.role_cd ?? null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const childItemRenderer = (item: any) => (
    <a
      className={classNames(
        "ddg-sidebar__item flex align-items-center p-menuitem-link cursor-pointer text-700",
        { "justify-content-center px-0": collapsed },
      )}
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
      {!collapsed && item.badge && (
        <Badge className="ml-auto" value={item.badge} />
      )}
      {!collapsed && item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );
  const allItems: any[] = [
    {
      label: "Inicio",
      icon: "pi pi-home",
      url: "/dashboard",
      template: childItemRenderer,
    },
    {
      label: "Administracion",
      icon: "pi pi-sliders-h",
      items: [
        {
          label: "Usuarios",
          icon: "pi pi-user",
          url: "/users",
          template: childItemRenderer,
        },
        {
          label: "Roles",
          icon: "pi pi-sliders-h",
          url: "/roles",
          template: childItemRenderer,
        },
        {
          label: "Asignaciones",
          icon: "pi pi-arrow-right-arrow-left",
          url: "/assignaments",
          template: childItemRenderer,
        },
      ],
    },
    {
      label: "Cafeteria",
      icon: "bi bi-fork-knife",
      items: [
        {
          label: "Gestionar productos",
          icon: "bi bi-box",
          url: "/coffee/products",
          template: childItemRenderer,
        },
      ],
    },
    {
      label: "Eventos",
      icon: "pi pi-calendar",
      items: [
        {
          label: "Gestionar eventos",
          icon: "pi pi-address-book",
          url: "/events/new",
          template: childItemRenderer,
        },
        {
          label: "Calendario",
          icon: "pi pi-calendar",
          url: "/events",
          template: childItemRenderer,
        },
      ],
    },
    {
      label: "Configuración",
      icon: "pi pi-cog",
      items: [
        {
          label: "Perfil",
          icon: "pi pi-user",
          url: "/profile/settings",
          template: childItemRenderer,
        },
        {
          label: "Cerrar Sesión",
          icon: "pi pi-sign-out",
          command: () => {
            logout();
          },
          template: childItemRenderer,
        },
      ],
    },
  ];

  let items: any[] = [];
  if (role === "ADMIN" || role === "LEADER") {
    items = allItems;
  } else if (role === "USER") {
    const allowedSectionLabels = ["Inicio", "Eventos", "Configuración"];

    const userItems = allItems
      .map((section) => {
        if (section.label === "Eventos") {
          return {
            ...section,
            items: section.items.filter(
              (child: any) => child.label === "Calendario",
            ),
          };
        }
        return section;
      })
      .filter((section) => allowedSectionLabels.includes(section.label));

    items = userItems;
  }

  return (
    <div className="ddg-sidebar h-full overflow-y-auto w-full">
      <div
        className={classNames("ddg-sidebar__brand", {
          "justify-content-center": collapsed,
        })}
      >
        {!collapsed && (
          <>
            <span className="ddg-sidebar__brand-title">Centro de control</span>
            <span className="ddg-sidebar__brand-subtitle">
              Navegacion corporativa
            </span>
          </>
        )}
        {collapsed && <i className="pi pi-compass" aria-hidden="true" />}
      </div>
      <PanelMenu
        model={items}
        className={classNames("w-full border-none ddg-sidebar__menu", {
          "collapsed-menu": collapsed,
        })}
        style={{ width: "100%" }}
        multiple={false}
      />
    </div>
  );
}
