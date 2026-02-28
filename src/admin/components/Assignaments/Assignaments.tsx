import { useEffect, useMemo, useRef, useState } from "react";
import { MainLayout } from "../../../ddg/components/Layout/MainLayout";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { AuthService } from "../../services/auth.service";
import { RolesService } from "../../services/roles.service";
import { AssignamentsService } from "../../services/assignaments.service";
import { DepartmentService } from "../../../ddg/services/departments.service";
import { TabView, TabPanel } from "primereact/tabview";
import type { IRoleAssignament, IUserDepartmentAssignament } from "../../interfaces/assignament.interface";
import type { IDepartment } from "../../../ddg/interfaces/department.interface";
import { useScreenService } from "../../../system/shared/services/screen.service";
import { useEvents } from "../../../ddg/hooks/useEvents";


interface User {
    user_id: number;
    user_nm: string;
    email: string;
    is_manager: boolean
    is_active: boolean;
}

interface Role {
    role_id: number;
    role_nm: string;
    role_ds: string;
}

export const Assignaments = () => {
    const { getUnassignedUsers } = useEvents();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [roleAssignments, setRoleAssignments] = useState<IRoleAssignament[]>([]);
    const [departmentAssignments, setDepartmentAssignments] = useState<IUserDepartmentAssignament[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [managerDepartmentId, setManagerDepartmentId] = useState<number | null>(null);
    const [selectedManagerUserId, setSelectedManagerUserId] = useState<number | null>(null);
    const [memberDepartmentId, setMemberDepartmentId] = useState<number | null>(null);
    const [selectedMemberUserId, setSelectedMemberUserId] = useState<number | null>(null);
    const [unassignedUsers, setUnassignedUsers] = useState<{ label: string, value: number }[]>([]);
    const [selectedReportsToUserId, setSelectedReportsToUserId] = useState<number | null>(null);
    const { sizes } = useScreenService();

    const isMobile = sizes["screen-x-small"] || sizes["screen-small"];

    const toast = useRef<Toast>(null);

    const authService = new AuthService();
    const rolesService = new RolesService();
    const assignamentsService = new AssignamentsService();
    const departmentService = new DepartmentService();

    useEffect(() => {
        void loadData();
    }, []);

    useEffect(() => {
        const fetchUnassigned = async () => {
            if (memberDepartmentId) {
                const users = await getUnassignedUsers(memberDepartmentId);
                setUnassignedUsers(Array.isArray(users)
                    ? users.map((user: any) => ({ label: user.user_nm, value: user.user_id }))
                    : []);
            } else {
                setUnassignedUsers([]);
            }
        };
        fetchUnassigned();
    }, [memberDepartmentId]);

    const toArray = <T,>(data: unknown): T[] => {
        if (Array.isArray(data)) {
            return data as T[];
        }

        if (data && typeof data === "object" && "data" in data) {
            const nestedData = (data as { data?: unknown }).data;
            if (Array.isArray(nestedData)) {
                return nestedData as T[];
            }
        }

        return [];
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, rolesData, assignmentsData, departmentsData] = await Promise.all([
                authService.getAll(),
                rolesService.getAll(),
                assignamentsService.getAll(),
                departmentService.getAll()
            ]);

            const departmentData = await assignamentsService.getAssign().catch(() => []);

            setUsers(toArray<User>(usersData));
            setRoles(toArray<Role>(rolesData));
            setRoleAssignments(toArray<IRoleAssignament>(assignmentsData));
            setDepartmentAssignments(toArray<IUserDepartmentAssignament>(departmentData));
            setDepartments(toArray<IDepartment>(departmentsData));
        } catch (error) {
            console.error("Error loading data:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error cargando datos' });
        } finally {
            setLoading(false);
        }
    };

    const openAssignDialog = (user: User) => {
        setSelectedUser(user);
        setSelectedRole(null);
        setDialogVisible(true);
    };

    const handleAssign = async () => {
        if (!selectedUser || !selectedRole) {
            toast.current?.show({ severity: 'warn', summary: 'Atención', detail: 'Seleccione un rol' });
            return;
        }

        setActionLoading(true);
        try {
            const exists = roleAssignments.some(a => a.user_id === selectedUser.user_id && a.role_id === selectedRole.role_id);
            if (exists) {
                toast.current?.show({ severity: 'info', summary: 'Info', detail: 'El usuario ya tiene este rol asignado' });
                setActionLoading(false);
                return;
            }

            const newAssignment = {
                user_id: selectedUser.user_id,
                role_id: selectedRole.role_id
            };

            const response = await assignamentsService.create(newAssignment);
            const createdAssignment = (response && typeof response === "object" && "data" in response)
                ? (response as { data: IRoleAssignament }).data
                : (response as IRoleAssignament);

            setRoleAssignments([...roleAssignments, createdAssignment]);

            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Rol asignado correctamente' });
            setDialogVisible(false);
            void loadData();
        } catch (error) {
            console.error("Error creating assignment:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar el rol' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveRole = async (userId: number, roleId: number) => {
        try {
            await assignamentsService.deleteAssignment(userId, roleId);
            setRoleAssignments(roleAssignments.filter(a => !(a.user_id === userId && a.role_id === roleId)));
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Rol removido correctamente' });
        } catch (error) {
            console.error("Error deleting assignment:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo remover el rol' });
        }
    };

    const isManagerAssignment = (assignment: IUserDepartmentAssignament) => {
        const assignmentAsLeader = assignment.is_leader === true;
        const assignmentAsDepartmentHead = assignment.reports_to === 0 || assignment.reports_to === assignment.user_id;
        const user = users.find((item) => item.user_id === assignment.user_id);
        const assignmentByUserFlag = user?.is_manager === true;

        return assignmentAsLeader || assignmentAsDepartmentHead || assignmentByUserFlag;
    };

    const assignmentsWithUserData = useMemo(() => {
        return departmentAssignments.map((assignment) => {
            const user = users.find((item) => item.user_id === assignment.user_id);
            return {
                ...assignment,
                user_nm: user?.user_nm ?? assignment.user_nm,
                email: user?.email ?? assignment.email
            };
        });
    }, [departmentAssignments, users]);

    const managerAssignments = useMemo(
        () => assignmentsWithUserData.filter((assignment) => isManagerAssignment(assignment)),
        [assignmentsWithUserData]
    );

    const memberAssignments = useMemo(
        () => assignmentsWithUserData.filter((assignment) => !isManagerAssignment(assignment)),
        [assignmentsWithUserData]
    );

    const managersByDepartment = useMemo(() => {
        return managerAssignments.reduce<Record<number, IUserDepartmentAssignament[]>>((acc, assignment) => {
            const departmentId = assignment.department_id;
            if (!acc[departmentId]) {
                acc[departmentId] = [];
            }
            acc[departmentId].push(assignment);
            return acc;
        }, {});
    }, [managerAssignments]);

    const managerUserOptions = useMemo(
        () => users
            .filter((user) => user.is_manager)
            .map((user) => ({ label: user.user_nm, value: user.user_id })),
        [users]
    );

    const departmentOptions = useMemo(() => {
        return departments
            .filter((department) => department.is_active)
            .sort((first, second) => first.department_nm.localeCompare(second.department_nm))
            .map((department) => ({
                label: department.department_nm,
                value: department.department_id
            }));
    }, [departments]);

    const managerOptionsForMember = useMemo(() => {
        if (!memberDepartmentId) {
            return [];
        }

        return (managersByDepartment[memberDepartmentId] ?? [])
            .map((assignment) => {
                return {
                    label: assignment.user_nm ?? `Usuario ${assignment.user_id}`,
                    value: assignment.user_id
                };
            })
            .sort((first, second) => first.label.localeCompare(second.label));
    }, [managersByDepartment, memberDepartmentId]);

    useEffect(() => {
        if (!memberDepartmentId || managerOptionsForMember.length === 0) {
            setSelectedReportsToUserId(null);
            return;
        }

        const hasSelectedManagerInDepartment = managerOptionsForMember.some(
            (option) => option.value === selectedReportsToUserId
        );

        if (!hasSelectedManagerInDepartment) {
            setSelectedReportsToUserId(managerOptionsForMember[0].value);
        }
    }, [memberDepartmentId, managerOptionsForMember, selectedReportsToUserId]);

    const formatDepartment = (departmentId: number) => {
        const department = departments.find((item) => item.department_id === departmentId);
        return department?.department_nm ?? `Departamento ${departmentId}`;
    };

    const resetDepartmentForm = () => {
        setManagerDepartmentId(null);
        setSelectedManagerUserId(null);
        setMemberDepartmentId(null);
        setSelectedMemberUserId(null);
        setSelectedReportsToUserId(null);
    };

    const handleAssignManager = async () => {
        if (!managerDepartmentId || !selectedManagerUserId) {
            toast.current?.show({ severity: "warn", summary: "Atención", detail: "Seleccione departamento y manager" });
            return;
        }

        const duplicate = departmentAssignments.some(
            (assignment) => assignment.department_id === managerDepartmentId && assignment.user_id === selectedManagerUserId
        );

        if (duplicate) {
            toast.current?.show({ severity: "info", summary: "Info", detail: "El usuario ya está asignado en este departamento" });
            return;
        }

        setActionLoading(true);
        try {
            await assignamentsService.assign({
                department_id: managerDepartmentId,
                user_id: selectedManagerUserId,
                reports_to: 0
            });
            toast.current?.show({ severity: "success", summary: "Éxito", detail: "Manager asignado correctamente" });
            resetDepartmentForm();
            void loadData();
        } catch (error) {
            console.error("Error assigning manager:", error);
            toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo asignar el manager" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssignMember = async () => {
        if (!memberDepartmentId || !selectedMemberUserId || !selectedReportsToUserId) {
            toast.current?.show({ severity: "warn", summary: "Atención", detail: "Complete departamento, integrante y manager" });
            return;
        }

        const duplicate = departmentAssignments.some(
            (assignment) => assignment.department_id === memberDepartmentId && assignment.user_id === selectedMemberUserId
        );

        if (duplicate) {
            toast.current?.show({ severity: "info", summary: "Info", detail: "El usuario ya está asignado en este departamento" });
            return;
        }

        setActionLoading(true);
        try {
            await assignamentsService.assign({
                department_id: memberDepartmentId,
                user_id: selectedMemberUserId,
                reports_to: selectedReportsToUserId
            });
            toast.current?.show({ severity: "success", summary: "Éxito", detail: "Integrante asignado correctamente" });
            resetDepartmentForm();
            void loadData();
        } catch (error) {
            console.error("Error assigning member:", error);
            toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo asignar el integrante" });
        } finally {
            setActionLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    const itemTemplate = (user: User) => {
        const userAssignments = roleAssignments.filter(a => a.user_id === user.user_id);
        const userRoles = userAssignments.map(a => {
            const role = roles.find(r => r.role_id === a.role_id);
            return { ...role, user_id: a.user_id, role_id: a.role_id };
        }).filter(r => r.role_id);

        return (
            <div className="col-12 md:col-6 lg:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round h-full flex flex-column">
                    <div className="flex align-items-center justify-content-between mb-3">
                        <div className="flex align-items-center">
                            <Avatar
                                label={getInitials(user.user_nm)}
                                size="large"
                                shape="circle"
                                className="mr-2 text-white font-bold"
                                style={{ backgroundColor: 'var(--primary-color)' }}
                            />
                            <div>
                                <div className="text-900 font-medium text-xl">{user.user_nm}</div>
                                <div className="text-600 text-sm">{user.email}</div>
                            </div>
                        </div>
                        <Button
                            icon="pi pi-plus"
                            rounded
                            text
                            severity="secondary"
                            aria-label="Assign Role"
                            tooltip="Asignar Rol"
                            onClick={() => openAssignDialog(user)}
                        />
                    </div>

                    <div className="flex-grow-1">
                        <div className="block font-medium text-500 mb-2 text-sm">ROLES ASIGNADOS</div>
                        <div className="flex flex-wrap gap-2">
                            {userRoles.length > 0 ? (
                                userRoles.map((role: any) => (
                                    <Tag
                                        key={`${user.user_id}-${role.role_id}`}
                                        className="py-1 px-2"
                                        severity="info"
                                        rounded
                                    >
                                        <div className="flex align-items-center gap-2">
                                            <span>{role.role_nm}</span>
                                            <i
                                                className="pi pi-times cursor-pointer hover:text-red-500 transition-colors"
                                                onClick={() => handleRemoveRole(user.user_id, role.role_id)}
                                                style={{ fontSize: '0.7rem' }}
                                                title="Remover rol"
                                            ></i>
                                        </div>
                                    </Tag>
                                ))
                            ) : (
                                <span className="text-500 text-sm font-italic">Sin roles asignados</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const groupedManagerAssignments = useMemo(
        () => Object.entries(managersByDepartment),
        [managersByDepartment]
    );

    const groupedMemberAssignments = useMemo(() => {
        return memberAssignments.reduce<Record<number, IUserDepartmentAssignament[]>>((acc, assignment) => {
            const departmentId = assignment.department_id;
            if (!acc[departmentId]) {
                acc[departmentId] = [];
            }
            acc[departmentId].push(assignment);
            return acc;
        }, {});
    }, [memberAssignments]);

    return (
        <MainLayout>
            <Toast ref={toast} />
            <TabView>
                <TabPanel
                    header="Asignar Roles"
                    leftIcon="pi pi-person-add"
                >
                    <div className="mb-3 md:mb-4">
                        <h1 className="m-0">Gestión de Asignaciones</h1>
                        <p className="text-500">Asigna roles a los usuarios del sistema.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-content-center p-5">
                            <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
                        </div>
                    ) : (
                        <DataView value={users} itemTemplate={itemTemplate} layout="grid" paginator rows={isMobile ? 6 : 9} />
                    )}

                    <Dialog
                        header={`Asignar Rol a ${selectedUser?.user_nm}`}
                        visible={dialogVisible}
                        style={{ width: '32rem' }}
                        breakpoints={{ '992px': '75vw', '576px': '95vw' }}
                        onHide={() => setDialogVisible(false)}
                        footer={
                            <div>
                                <Button label="Cancelar" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
                                <Button label="Asignar" icon="pi pi-check" onClick={handleAssign} autoFocus loading={actionLoading} />
                            </div>
                        }
                    >
                        <div className="flex flex-column gap-2 pt-4">
                            <label htmlFor="role-select" className="font-bold">Seleccione un rol</label>
                            <Dropdown
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.value)}
                                options={roles}
                                optionLabel="role_nm"
                                placeholder="Selecciona un rol"
                                className="w-full"
                                filter
                            />
                        </div>
                    </Dialog>
                </TabPanel>
                <TabPanel
                    header="Asignar Ministerios"
                    leftIcon="pi pi-sitemap"
                >
                    <div className="mb-4">
                        <h1 className="m-0">Asignaciones por Ministerio</h1>
                        <p className="text-500">Administra usuarios como lideres e integrantes por ministerios.</p>
                    </div>

                    <TabView>
                        <TabPanel header="Lideres" leftIcon="pi pi-user-plus">
                            <div className="surface-card border-1 surface-border border-round p-4 mb-4">
                                <div className="grid formgrid">
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="manager-department" className="font-bold block mb-2">Ministerio</label>
                                        <Dropdown
                                            id="manager-department"
                                            value={managerDepartmentId}
                                            onChange={(event) => setManagerDepartmentId((event.value as number) ?? null)}
                                            options={departmentOptions}
                                            placeholder="Seleccione un departamento"
                                            filter
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="field col-12 md:col-5">
                                        <label htmlFor="manager-user" className="font-bold block mb-2">Manager</label>
                                        <Dropdown
                                            id="manager-user"
                                            value={selectedManagerUserId}
                                            onChange={(event) => setSelectedManagerUserId(event.value as number)}
                                            options={managerUserOptions}
                                            placeholder="Seleccione un manager"
                                            filter
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="field col-12 md:col-3 flex align-items-end">
                                        <Button
                                            label="Asignar"
                                            icon="pi pi-check"
                                            onClick={handleAssignManager}
                                            loading={actionLoading}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {groupedManagerAssignments.length === 0 ? (
                                <div className="text-500 font-italic">Sin lideres asignados todavía.</div>
                            ) : (
                                groupedManagerAssignments.map(([departmentId, assignments]) => (
                                    <div key={departmentId} className="surface-card border-1 surface-border border-round p-3 mb-3">
                                        <div className="font-bold mb-2">{formatDepartment(Number(departmentId))}</div>
                                        <div className="flex flex-wrap gap-2">
                                            {assignments.map((assignment) => {
                                                return (
                                                    <Tag
                                                        key={`${assignment.department_id}-${assignment.user_id}`}
                                                        value={assignment.user_nm ?? `Usuario ${assignment.user_id}`}
                                                        severity="success"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </TabPanel>

                        <TabPanel header="Integrantes" leftIcon="pi pi-users">
                            <div className="surface-card border-1 surface-border border-round p-4 mb-4">
                                <div className="grid formgrid">
                                    <div className="field col-12 md:col-3">
                                        <label htmlFor="member-department" className="font-bold block mb-2">Departamento</label>
                                        <Dropdown
                                            id="member-department"
                                            value={memberDepartmentId}
                                            onChange={(event) => {
                                                const newDepartmentId = (event.value as number) ?? null;
                                                setMemberDepartmentId(newDepartmentId);
                                                setSelectedReportsToUserId(null);
                                            }}
                                            options={departmentOptions}
                                            placeholder="Seleccione un departamento"
                                            filter
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="member-user" className="font-bold block mb-2">Integrante</label>
                                        <Dropdown
                                            id="member-user"
                                            value={selectedMemberUserId}
                                            onChange={(event) => setSelectedMemberUserId(event.value as number)}
                                            options={unassignedUsers}
                                            placeholder="Seleccione un integrante"
                                            filter
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="field col-12 md:col-3">
                                        <label htmlFor="member-manager" className="font-bold block mb-2">Lider</label>
                                        <Dropdown
                                            id="member-manager"
                                            value={selectedReportsToUserId}
                                            options={managerOptionsForMember}
                                            placeholder="Se asigna por departamento"
                                            disabled
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="field col-12 md:col-2 flex align-items-end">
                                        <Button
                                            label="Asignar"
                                            icon="pi pi-check"
                                            onClick={handleAssignMember}
                                            loading={actionLoading}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {Object.keys(groupedMemberAssignments).length === 0 ? (
                                <div className="text-500 font-italic">Sin integrantes asignados todavía.</div>
                            ) : (
                                Object.entries(groupedMemberAssignments).map(([departmentId, assignments]) => (
                                    <div key={departmentId} className="surface-card border-1 surface-border border-round p-3 mb-3">
                                        <div className="font-bold mb-2">{formatDepartment(Number(departmentId))}</div>
                                        <div className="flex flex-column gap-2">
                                            {assignments.map((assignment) => {
                                                const manager = users.find((user) => user.user_id === assignment.reports_to);
                                                return (
                                                    <div key={`${assignment.department_id}-${assignment.user_id}`} className="flex flex-column md:flex-row md:align-items-center justify-content-between gap-2 border-1 surface-border border-round p-2">
                                                        <span>{assignment.user_nm ?? `Usuario ${assignment.user_id}`}</span>
                                                        <Tag value={`Manager: ${manager?.user_nm ?? `Usuario ${assignment.reports_to}`}`} severity="info" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </TabPanel>
                    </TabView>
                </TabPanel>
            </TabView>

            <style>{`
                @media (max-width: 576px) {
                    .p-tabview .p-tabview-nav {
                        overflow-x: auto;
                        flex-wrap: nowrap;
                    }

                    .p-tabview .p-tabview-nav li .p-tabview-nav-link {
                        white-space: nowrap;
                        padding: 0.75rem 1rem;
                    }
                }
            `}</style>
        </MainLayout>
    );
};