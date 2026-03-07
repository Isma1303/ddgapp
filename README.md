# DDG App

Aplicacion web desarrollada con React + TypeScript para gestion interna de eventos, usuarios, roles y asignaciones.

## Modulos de la aplicacion

### `src/admin`

Modulo de administracion.

- `components/Login`: inicio de sesion.
- `components/Users`: CRUD de usuarios, activacion, perfil y cambio de contrasena.
- `components/Roles`: CRUD de roles.
- `components/Assignaments`: asignacion de roles y asignacion de usuarios a departamentos (manager/integrante).
- `components/profile`: configuracion de perfil y mensajes.
- `hooks`: logica de formularios y datagrids (`useLoginForm`, `useUsersDataGrid`, `useRolesDataGrid`, etc.).
- `services`: consumo de APIs de auth, roles y asignaciones.

### `src/ddg`

Modulo funcional principal del sistema.

- `pages/dashboard`: vista de entrada para usuarios autenticados.
- `components/events`: calendario de eventos, detalle y creacion de eventos.
- `components/announcements`: modulo de anuncios/documentos (base).
- `components/Layout`: layout principal con header, sidebar y footer.
- `hooks`: logica de dashboard y eventos.
- `services`: servicios de dashboard, eventos, departamentos y asistencia.

### `src/system`

Modulo transversal de infraestructura.

- `config.ts`: configuracion global (`VITE_API_URL`).
- `service.ts`: `ParentService` basado en Axios con interceptores de autenticacion.
- `shared/libs`: rutas publicas/privadas y control de navegacion.
- `shared/store`: estado global de autenticacion con Zustand.
- `shared/services`: manejo de token y utilidades de pantalla/responsive.

## Librerias usadas

### Base

- `react` y `react-dom`
- `typescript`
- `vite`
- `react-router-dom`

### UI y experiencia visual

- `primereact`: componentes UI (DataTable, Dialog, PanelMenu, Toast, Button, etc.).
- `primeicons`: iconografia de PrimeReact.
- `primeflex`: utilidades CSS para layout responsive.
- `bootstrap-icons`: iconos adicionales.

### Calendario y fechas

- `react-big-calendar`: calendario principal para eventos.
- `react-big-schedule`: soporte de planificacion.
- `dayjs`: manejo y formateo de fechas.

### Estado y red

- `zustand`: estado global de autenticacion.
- `axios`: cliente HTTP para consumir APIs.

### Otras

- `react-dnd` y `react-dnd-html5-backend`: interacciones drag and drop.
- `dotenv`: soporte para variables de entorno.

## Estilos actuales

La UI combina estilos de libreria con estilos locales:

1. Tema global de PrimeReact cargado en `src/App.tsx`:
   `lara-light-cyan` + `primereact.min.css` + `primeicons.css` + `primeflex.css`.

2. Enfoque visual predominante:

- Uso de utilidades PrimeFlex (`flex`, `gap`, `surface-card`, `shadow-*`, `border-round`).
- Componentes PrimeReact como base de la interfaz.
- Estilo claro (sin modo oscuro implementado de forma global).

3. CSS personalizado actual:

- `src/admin/components/Login/LoginForm.css`: estilos del formulario de login y responsive basico.
- `src/ddg/components/events/NewEvent/NewEvent.css`: estilos mas completos del proyecto (cards, variables CSS, animaciones, formulario y responsive).
- `src/ddg/components/events/Events.css`: ajustes puntuales para acciones de cards.

4. Notas importantes:

- Varios archivos CSS existen como placeholders y actualmente estan vacios (por ejemplo header, sidebar, footer, dashboard, users).
- En `Events.tsx` tambien hay estilos inline para personalizar `react-big-calendar`.

## Rutas principales

- `/`: login (ruta publica).
- `/dashboard`: dashboard.
- `/events`: calendario de eventos.
- `/events/new`: administracion/creacion de eventos.
- `/events/detail/:event_id` y `/events/:event_id`: detalle de evento.
- `/announcements`: anuncios.
- `/users`, `/roles`, `/assignaments`: administracion.
- `/profile/settings` y `/profile/messages`: perfil.

Todas las rutas privadas se protegen con `PrivateRoute`.

## Configuracion de entorno

Variable esperada:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Si no se define, la app usa ese valor por defecto (`src/system/config.ts`).

## Scripts

- `npm run dev`: entorno de desarrollo.
- `npm run build`: compilacion TypeScript + build de Vite.
- `npm run preview`: vista previa del build.
- `npm run lint`: lint del proyecto.

## Ejecucion local

```bash
npm install
npm run dev
```
