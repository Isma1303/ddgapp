import React, { useState, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MainLayout } from '../../../ddg/components/Layout/MainLayout';
import { useRolesDataGrid } from '../../hooks/useRolesDataGrid';
import type { IRole, IRoleNew } from '../../interfaces/role.interface';
import { Tag } from 'primereact/tag';
import { Checkbox } from 'primereact/checkbox';
import { useScreenService } from '../../../system/shared/services/screen.service';

export const Roles = () => {
    let emptyRole: IRoleNew = {
        role_nm: '',
        is_active: true
    };

    const { roles, handleCreate, handleUpdate, handleDelete } = useRolesDataGrid();
    const [roleDialog, setRoleDialog] = useState(false);
    const [role, setRole] = useState<any>(emptyRole);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const { sizes } = useScreenService();

    const isMobile = sizes['screen-x-small'] || sizes['screen-small'];

    const openNew = () => {
        setRole(emptyRole);
        setSubmitted(false);
        setRoleDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRoleDialog(false);
    };

    const saveRole = async () => {
        setSubmitted(true);

        if (role.role_nm.trim()) {
            let _role = { ...role };

            try {
                if (role.role_id) {
                    await handleUpdate(role.role_id, _role);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Role Updated', life: 3000 });
                } else {
                    await handleCreate(_role);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Role Created', life: 3000 });
                }
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Operation failed', life: 3000 });
                console.error(error);
            }

            setRoleDialog(false);
            setRole(emptyRole);
        }
    };

    const editRole = (role: IRole) => {
        setRole({ ...role });
        setRoleDialog(true);
    };

    const confirmDeleteRole = (role: IRole) => {
        handleDelete(role.role_id);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Role Deleted', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _role = { ...role };
        _role[`${name}`] = val;

        setRole(_role);
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" aria-label="Edit" onClick={() => editRole(rowData)} style={{ height: '2rem', width: '2rem' }} />
                <Button icon="pi pi-trash" rounded severity="danger" aria-label="Delete" onClick={() => confirmDeleteRole(rowData)} style={{ marginLeft: '0.5rem', height: '2rem', width: '2rem' }} />
            </>
        );
    };

    const isActiveBody = (rowData: any) => {
        const icon = rowData.is_active ? 'pi pi-verified' : 'pi pi-times-circle';
        const style = rowData.is_active
            ? { backgroundColor: '#E0F9E8', color: '#1B9C31', alignItems: 'center' }
            : { backgroundColor: '#FFEAEA', color: '#EF4444', alignItems: 'center' };

        return <Tag value={rowData.is_active ? 'Activo' : 'Inactivo'} icon={icon} style={style} rounded />;
    }

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl font-semibold">Roles</span>
            <Button icon="pi pi-plus" label="Agregar Rol" onClick={() => openNew()} />
        </div>
    );

    const roleDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={() => saveRole()} />
        </React.Fragment>
    );

    const roleCard = (rowData: IRole) => (
        <div key={rowData.role_id} className="surface-card border-1 surface-border border-round p-3 mb-3">
            <div className="flex justify-content-between align-items-start gap-2">
                <div className="text-900 font-semibold">{rowData.role_nm}</div>
                {isActiveBody(rowData)}
            </div>
            <div className="flex align-items-center justify-content-end gap-2 mt-3">
                <Button icon="pi pi-pencil" rounded severity="success" aria-label="Edit" onClick={() => editRole(rowData)} style={{ height: '2rem', width: '2rem' }} />
                <Button icon="pi pi-trash" rounded severity="danger" aria-label="Delete" onClick={() => confirmDeleteRole(rowData)} style={{ height: '2rem', width: '2rem' }} />
            </div>
        </div>
    );

    return (
        <MainLayout>
            <Toast ref={toast} />
            <h3 className="text-2xl font-bold">Roles</h3>

            {!isMobile && (
                <DataTable
                    value={roles}
                    showGridlines
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    selectionMode="single"
                    dataKey="role_id"
                    header={header}
                >
                    <Column field="role_nm" header="Nombre del Rol" dataType='string' sortable></Column>
                    <Column field="is_active" header="Activo" dataType='boolean' body={isActiveBody}></Column>
                    <Column header="Acciones" body={actionBodyTemplate} exportable={false} style={{ width: '15%' }}></Column>
                </DataTable>
            )}

            {isMobile && (
                <div>
                    <div className="flex flex-column gap-2 mb-3">
                        <span className="text-xl font-semibold">Roles</span>
                        <Button icon="pi pi-plus" label="Agregar Rol" onClick={() => openNew()} className="w-full" />
                    </div>
                    {roles.map((currentRole) => roleCard(currentRole))}
                </div>
            )}

            <Dialog visible={roleDialog} style={{ width: '32rem' }} breakpoints={{ '992px': '75vw', '576px': '95vw' }} header="Detalles del Rol" modal className="p-fluid" footer={roleDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <div className="field">
                        <label htmlFor="role_nm" className="font-bold">Nombre</label>
                        <InputText id="role_nm" value={role.role_nm} onChange={(e) => onInputChange(e, 'role_nm')} required autoFocus className={classNames({ 'p-invalid': submitted && !role.role_nm })} />
                        {submitted && !role.role_nm && <small className="p-error">Name is required.</small>}
                    </div>
                    <div className="field flex gap-2 align-items-center">
                        <Checkbox inputId="is_active" checked={role.is_active} onChange={(e) => setRole({ ...role, is_active: e.checked })} />
                        <label htmlFor="is_active" className="font-bold mb-0">Activo</label>
                    </div>
                </div>
            </Dialog>
        </MainLayout>
    )
}