import { MainLayout } from "../../../ddg/components/Layout/MainLayout";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import { useProfileConfig } from "../../hooks/useProfileConfig";
import { useScreenService } from "../../../system/shared/services/screen.service";

export const Settings = () => {
    const { sizes } = useScreenService();
    const isMobile = sizes["screen-x-small"] || sizes["screen-small"];

    const {
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
    } = useProfileConfig();

    const dialogFooter = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayEditDialog(false)} className="p-button-text" />
            <Button label="Guardar" icon="pi pi-check" onClick={handleUpdateProfile} autoFocus loading={loading} />
        </div>
    );

    return (
        <MainLayout>
            <Toast ref={toast} />
            <div className="mb-4">
                <h1 className="m-0">Configuración</h1>
            </div>

            <div className="surface-card p-4 shadow-2 border-round">
                <div className="flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="text-xl font-medium text-900">Perfil de Usuario</div>
                        <p className="text-500 mb-0">Administra tu información personal y seguridad.</p>
                    </div>
                </div>

                {profileData ? (
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="flex align-items-center mb-5">
                                <Avatar
                                    label={getInitials(profileData.user_nm)}
                                    size="xlarge"
                                    shape="circle"
                                    className="mr-4 surface-ground text-900 font-bold shadow-1"
                                    style={{ width: isMobile ? '72px' : '100px', height: isMobile ? '72px' : '100px', fontSize: isMobile ? '1.75rem' : '2.5rem' }}
                                />
                                <div className="flex flex-column">
                                    <div className="text-2xl font-bold text-900">{profileData.user_nm} {profileData.user_lt}</div>
                                    <div className="text-600 font-medium">{profileData.email}</div>
                                    <div className={`mt-2 inline-block px-2 py-1 border-round text-sm font-bold w-min ${profileData.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {profileData.is_active ? 'Activo' : 'Inactivo'}
                                    </div>
                                    <Button label="Editar Perfil" icon="pi pi-pencil" className="p-button-sm mt-3 p-button-outlined" onClick={openEditDialog} />
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor="user_nm" className="block text-900 font-medium mb-2">Nombre</label>
                                <InputText id="user_nm" value={profileData.user_nm || ''} className="w-full p-inputtext-lg" disabled />
                            </div>
                            <div className="field">
                                <label htmlFor="email" className="block text-900 font-medium mb-2">Correo Electrónico</label>
                                <InputText id="email" value={profileData.email || ''} className="w-full p-inputtext-lg" disabled />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="border-1 surface-border border-round p-4 h-full">
                                <div className="text-xl font-medium text-900 mb-3 flex align-items-center">
                                    <i className="pi pi-lock mr-2 text-primary"></i>
                                    Cambiar Contraseña
                                </div>
                                <Divider className="mb-4" />

                                <div className="field">
                                    <label htmlFor="newPass" className="block text-900 font-medium mb-2">Nueva Contraseña</label>
                                    <Password
                                        id="newPass"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        toggleMask
                                        className="w-full"
                                        inputClassName="w-full p-inputtext-lg"
                                        promptLabel="Ingrese una contraseña"
                                        weakLabel="Débil"
                                        mediumLabel="Media"
                                        strongLabel="Fuerte"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="confirmPass" className="block text-900 font-medium mb-2">Confirmar Contraseña</label>
                                    <Password
                                        id="confirmPass"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        toggleMask
                                        className="w-full"
                                        inputClassName="w-full p-inputtext-lg"
                                        feedback={false}
                                    />
                                </div>
                                <Button label="Actualizar Contraseña" icon="pi pi-check" loading={loading} onClick={handleChangePassword} className="mt-2" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-content-center align-items-center" style={{ height: '300px' }}>
                        <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
                        <span className="ml-3 text-lg text-700">Cargando información del perfil...</span>
                    </div>
                )}
            </div>

            <Dialog header="Editar Perfil" visible={displayEditDialog} style={{ width: '450px' }} breakpoints={{ '992px': '75vw', '576px': '95vw' }} footer={dialogFooter} onHide={() => setDisplayEditDialog(false)}>
                <div className="field">
                    <label htmlFor="edit_user_nm" className="block text-900 font-medium mb-2">Nombre</label>
                    <InputText
                        id="edit_user_nm"
                        value={editData.user_nm}
                        onChange={(e) => setEditData({ ...editData, user_nm: e.target.value })}
                        className="w-full"
                        autoFocus
                    />
                </div>
                <div className="field">
                    <label htmlFor="edit_email" className="block text-900 font-medium mb-2">Correo Electrónico</label>
                    <InputText
                        id="edit_email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full"
                    />
                </div>
            </Dialog>
        </MainLayout>
    );
};
