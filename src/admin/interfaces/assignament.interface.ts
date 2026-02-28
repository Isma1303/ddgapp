export interface IUserAssignament {
    department_id: number;
    user_id: number;
    reports_to: number;
    is_leader?: boolean;
}

export interface IUserDepartmentAssignament extends IUserAssignament {
    department_nm?: string;
    user_nm?: string;
    email?: string;
}

export interface IRoleAssignament {
    user_id: number;
    role_id: number;
}