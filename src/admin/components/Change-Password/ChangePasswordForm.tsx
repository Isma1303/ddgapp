import { Password } from "primereact/password";
import { useChangePasswordForm } from "../../hooks/useChangePasswordForm";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { useRef, useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Toast } from 'primereact/toast';
import type { IUser } from '../../interfaces/user.interface';

interface ChangePasswordFormProps {
    visible: boolean;
    onHide: () => void;
    user: IUser | null;
}

export const ChangePasswordForm = ({ visible, onHide, user }: ChangePasswordFormProps) => {
    const { changePassword } = useChangePasswordForm();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (visible) {
            setPassword("");
            setConfirmPassword("");
        }
    }, [visible]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden', life: 3000 });
            return;
        }

        if (!password) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'La contraseña es requerida', life: 3000 });
            return;
        }

        if (user && user.user_id) {
            try {
                await changePassword(user.user_id, password);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente', life: 3000 });
                setTimeout(() => {
                    onHide();
                }, 1000);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la contraseña', life: 3000 });
            }
        }
    };

    const footer = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" severity="secondary" />
            <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit} autoFocus />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} onHide={onHide} header={`Cambiar contraseña`} footer={footer} style={{ width: '28rem' }} breakpoints={{ '992px': '75vw', '576px': '95vw' }}>
                <div className="flex flex-column gap-2">
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="field">
                            <label htmlFor="pwd" className="font-bold">Nueva Contraseña</label>
                            <Password id="pwd" value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false} />
                        </div>
                        <div className="field">
                            <label htmlFor="conf-pwd" className="font-bold">Confirmar Contraseña</label>
                            <Password id="conf-pwd" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask feedback={false} />
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    );
};