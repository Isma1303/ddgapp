import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../system/shared/store/authStore";
import type { Toast } from "primereact/toast";
import { AuthService } from "../services/auth.service";

export const useProfileConfig = () => {
    const { user } = useAuthStore();
    const [profileData, setProfileData] = useState<any>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const authService = new AuthService();

    useEffect(() => {
        if (user && user.user_id) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            const response = await authService.profile(user.user_id);
            setProfileData(response.data);
        } catch (error) {
            console.error("Error loading profile:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el perfil' });
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            toast.current?.show({ severity: 'warn', summary: 'Atención', detail: 'Por favor complete todos los campos' });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' });
            return;
        }

        if (newPassword.length < 6) {
            toast.current?.show({ severity: 'warn', summary: 'Atención', detail: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }

        setLoading(true);
        try {
            await authService.changePassword(user.user_id, newPassword);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente' });
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error changing password:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña' });
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name ? name.charAt(0).toUpperCase() : "U";
    };

    const [displayEditDialog, setDisplayEditDialog] = useState(false);
    const [editData, setEditData] = useState({ user_nm: '', email: '' });

    const openEditDialog = () => {
        if (profileData) {
            setEditData({
                user_nm: profileData.user_nm,
                email: profileData.email
            });
            setDisplayEditDialog(true);
        }
    };

    const handleUpdateProfile = async () => {
        if (!editData.user_nm || !editData.email) {
            toast.current?.show({ severity: 'warn', summary: 'Atención', detail: 'Todos los campos son obligatorios' });
            return;
        }

        setLoading(true);
        try {
            // Assuming update method accepts user_id and partial data
            await authService.update(user.user_id, editData as any);

            // Update local state
            setProfileData({ ...profileData, ...editData });
            setDisplayEditDialog(false);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente' });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el perfil' });
        } finally {
            setLoading(false);
        }
    };

    return {
        profileData,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        toast,
        handleChangePassword,
        getInitials,
        displayEditDialog,
        setDisplayEditDialog,
        editData,
        setEditData,
        openEditDialog,
        handleUpdateProfile
    };
}