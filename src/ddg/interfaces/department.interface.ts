export interface IDepartment {
    department_id: number;
    department_nm: string;
    is_active: boolean;
}

export interface IDepartmentNew extends Omit<IDepartment, 'department_id'> { }
export interface IDepartmentUpdate extends Partial<IDepartment> { }
