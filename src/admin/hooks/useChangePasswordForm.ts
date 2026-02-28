import { AuthService } from "../services/auth.service"

export const useChangePasswordForm = () => {
    const userService = new AuthService()

    const changePassword = async (user_id: number, password: string) => {
        try {
            const response = await userService.changePassword(user_id, password)
            return response
        } catch (error) {
            throw error
        }
    }
    return {
        changePassword
    }
}