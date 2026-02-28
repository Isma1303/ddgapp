import { useEffect, useState } from "react";
import { AuthService } from "../services/auth.service";
import type { IUser, IUserNew } from "../interfaces/user.interface";

export const useUsersDataGrid = () => {
    const userService = new AuthService()
    const [users, setUsers] = useState<IUser[]>([]);

    const getUsers = async () => {
        const response: any = await userService.getAll()
        setUsers(response.data)
    }

    useEffect(() => {
        getUsers()
    }, [])

    const handleCreate = async (data: IUserNew) => {
        const response: any = await userService.register(data)
        getUsers()
        return response
    }
    const handleUpdate = async (user_id: number, data: IUser) => {
        const response: any = await userService.update(Number(user_id), data)
        getUsers()
        return response
    }

    const handleDelete = async (user_id: number) => {
        const response: any = await userService.deleteUser(Number(user_id))
        getUsers()
        return response
    }

    return { users, handleCreate, handleUpdate, handleDelete }
}