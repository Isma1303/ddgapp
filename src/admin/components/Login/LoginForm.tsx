import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useLoginForm } from "../../hooks/useLoginForm";
import { Toast } from 'primereact/toast';
import "./LoginForm.css";
import { Password } from "primereact/password";
import { useScreenService } from "../../../system/shared/services/screen.service";

export const LoginForm = () => {
    const { login, loading } = useLoginForm();
    const { sizes } = useScreenService();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toastTopRight = useRef<Toast>(null);
    const isMobile = sizes["screen-x-small"] || sizes["screen-small"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            toastTopRight.current?.show({ severity: 'success', summary: 'Success', detail: 'Message' });
        } catch (error) {
            toastTopRight.current?.show({ severity: 'error', summary: 'Error', detail: 'Message' });
            console.error("Error en el formulario:", error);
        }
    };

    return (
        <>
            <Toast ref={toastTopRight} position="top-right" />
            <div className="login-container flex justify-content-center align-items-center" style={{ minHeight: isMobile ? '100dvh' : '100vh', padding: isMobile ? '1rem' : '0' }}>
                <div className="login-form" style={{ width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '420px' : 'none' }}>
                    <img src="/ddg_logo.jpg" className="form-logo" alt="Logo" />
                    <form className="flex flex-column gap-3" onSubmit={handleSubmit}>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="email">Correo Electronico</label>
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ingrese su correo electronico"
                            />
                        </div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="password">Contraseña</label>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingrese su contraseña"
                                toggleMask
                                feedback={false}
                            />
                        </div>
                        <Button
                            label="Iniciar Sesión"
                            icon="pi pi-user"
                            loading={loading}
                            type="submit"
                            className="mt-2"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};