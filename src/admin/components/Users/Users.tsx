import React, { useState, useRef } from 'react';
import { ChangePasswordForm } from '../Change-Password/ChangePasswordForm';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useUsersDataGrid } from '../../hooks/useUsersDataGrid';
import { MainLayout } from '../../../ddg/components/Layout/MainLayout';
import type { IUserNew, IUser } from '../../interfaces/user.interface';
import { Checkbox } from 'primereact/checkbox';
import { useScreenService } from '../../../system/shared/services/screen.service';


export const Users = () => {
    let emptyUser: IUserNew = {
        user_nm: '',
        user_lt: '',
        email: '',
        password: '',
        is_active: true,
        is_manager: false,
    };

    const { users, handleCreate, handleUpdate, handleDelete } = useUsersDataGrid();
    const [userDialog, setUserDialog] = useState(false);
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [user, setUser] = useState<any>(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const { sizes } = useScreenService();

    const isMobile = sizes['screen-x-small'] || sizes['screen-small'];

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const handleOpenChangePassword = (userData: IUser) => {
        setUser({ ...userData });
        setChangePasswordVisible(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const saveUser = async () => {
        setSubmitted(true);

        if (user.user_nm.trim()) {
            let _user = { ...user };

            try {
                if (user.user_id) {
                    await handleUpdate(user.user_id, _user);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                } else {
                    await handleCreate(_user);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Operation failed', life: 3000 });
                console.error(error);
            }

            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const editUser = (user: IUser) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: IUser) => {
        handleDelete(user.user_id);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    };

    const isActiveBody = (rowData: any) => {
        const icon = rowData.is_active ? 'pi pi-verified' : 'pi pi-times-circle';
        const style = rowData.is_active
            ? { backgroundColor: '#E0F9E8', color: '#1B9C31', alignItems: 'center' }
            : { backgroundColor: '#FFEAEA', color: '#EF4444', alignItems: 'center' };

        return <Tag value={rowData.is_active ? 'Activo' : 'Inactivo'} icon={icon} style={style} rounded />;
    }

    const isManagerBody = (rowData: any) => {
        const icon = rowData.is_manager ? 'pi pi-verified' : 'pi pi-user';
        const style = rowData.is_manager
            ? { backgroundColor: '#E0F9E8', color: '#1B9C31', alignItems: 'center' }
            : { backgroundColor: '#e5e0e0ff', color: '#716f6fff', alignItems: 'center' };

        return <Tag value={rowData.is_manager ? 'Lider' : 'Servidor'} icon={icon} style={style} rounded />;
    }

    const actionBodyTemplate = (rowData: any) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" aria-label="Edit" onClick={() => editUser(rowData)} style={{ height: '2rem', width: '2rem' }} />
                <Button icon="pi pi-key" rounded severity="warning" aria-label="Change Password" onClick={() => handleOpenChangePassword(rowData)} style={{ marginLeft: '0.5rem', height: '2rem', width: '2rem' }} />
                <Button icon="pi pi-trash" rounded severity="danger" aria-label="Delete" onClick={() => confirmDeleteUser(rowData)} style={{ marginLeft: '0.5rem', height: '2rem', width: '2rem' }} />
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl font-semibold"></span>
            <Button icon="pi pi-plus" label="Agregar Usuario" onClick={() => openNew()} />
        </div>
    );



    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={() => saveUser()} />
        </React.Fragment>
    );

    const userCard = (rowData: IUser) => (
        <div key={rowData.user_id} className="surface-card border-1 surface-border border-round p-3 mb-3">
            <div className="flex justify-content-between align-items-start gap-2">
                <div>
                    <div className="text-900 font-semibold">{rowData.user_nm} {rowData.user_lt}</div>
                    <div className="text-600 text-sm mt-1">{rowData.email}</div>
                </div>
                <div className="flex flex-wrap justify-content-end gap-1">
                    {isActiveBody(rowData)}
                    {isManagerBody(rowData)}
                </div>
            </div>

            <div className="flex align-items-center justify-content-end gap-2 mt-3">
                <Button icon="pi pi-pencil" rounded severity="success" aria-label="Edit" onClick={() => editUser(rowData)} style={{ height: '2rem', width: '2rem' }} />
                <Button icon="pi pi-key" rounded severity="warning" aria-label="Change Password" onClick={() => handleOpenChangePassword(rowData)} style={{ height: '2rem', width: '2rem' }} />
                <Button icon="pi pi-trash" rounded severity="danger" aria-label="Delete" onClick={() => confirmDeleteUser(rowData)} style={{ height: '2rem', width: '2rem' }} />
            </div>
        </div>
    );

    return (
        <MainLayout>
            <Toast ref={toast} />
            <h3 className="text-2xl font-bold">Usuarios</h3>

            {!isMobile && (
                <DataTable
                    value={users}
                    showGridlines
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    selectionMode="single"
                    dataKey="user_id"
                    header={header}
                >
                    <Column field="user_nm" header="Nombre" dataType='string' sortable ></Column>
                    <Column field="user_lt" header="Apellido" dataType='string' sortable></Column>
                    <Column field="email" header="Email" dataType='string' sortable></Column>
                    <Column field="is_manager" header="Perfil" dataType="boolean" body={isManagerBody} sortable></Column>
                    <Column field="is_active" header="Estado" dataType="boolean" body={isActiveBody} sortable></Column>
                    <Column header="Acciones" body={actionBodyTemplate} exportable={false} style={{ width: '15%' }}></Column>
                </DataTable>
            )}

            {isMobile && (
                <div>
                    <div className="flex flex-column gap-2 mb-3">
                        <span className="text-xl font-semibold"></span>
                        <Button icon="pi pi-plus" label="Agregar Usuario" onClick={() => openNew()} className="w-full" />
                    </div>
                    {users.map((currentUser) => userCard(currentUser))}
                </div>
            )}

            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '992px': '75vw', '576px': '95vw' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="user_nm" className="font-bold">Nombre</label>
                    <InputText id="user_nm" value={user.user_nm} onChange={(e) => onInputChange(e, 'user_nm')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.user_nm })} />
                    {submitted && !user.user_nm && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="user_lt" className="font-bold">Apellido</label>
                    <InputText id="user_lt" value={user.user_lt} onChange={(e) => onInputChange(e, 'user_lt')} required />
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold">Email</label>
                    <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required />
                </div>
                <div className="field flex gap-2 align-items-center">
                    <Checkbox inputId="is_active" checked={user.is_active} onChange={(e) => setUser({ ...user, is_active: e.checked })} />
                    <label htmlFor="is_active" className="font-bold mb-0">Activo</label>
                    <Checkbox inputId="is_manager" checked={user.is_manager} onChange={(e) => setUser({ ...user, is_manager: e.checked })} />
                    <label htmlFor="is_manager" className="font-bold mb-0">Lider</label>
                </div>
            </Dialog>
            <ChangePasswordForm visible={changePasswordVisible} onHide={() => setChangePasswordVisible(false)} user={user} />
        </MainLayout>
    )
}