import { useEffect, useState } from "react";
import { RolesService } from "../services/roles.service";
import type { IRole, IRoleNew, IRoleUpdate } from "../interfaces/role.interface";

export const useRolesDataGrid = () => {
    const rolesService = new RolesService();
    const [roles, setRoles] = useState<IRole[]>([]);

    const getRoles = async () => {
        try {
            const response: any = await rolesService.getAll();
            setRoles(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getRoles();
    }, [])

    const handleCreate = async (data: IRoleNew) => {
        const response: any = await rolesService.create(data);
        getRoles();
        return response
    }

    const handleUpdate = async (role_id: number, data: IRoleUpdate) => {
        const response: any = await rolesService.update(role_id, data);
        getRoles();
        return response
    }

    const handleDelete = async (role_id: number) => {
        const response: any = await rolesService.delete(role_id);
        getRoles();
        return response
    }

    return {
        roles,
        getRoles,
        handleCreate,
        handleUpdate,
        handleDelete
    }
}