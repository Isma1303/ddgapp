export interface IRole {
    role_id: number
    role_nm: string
    is_active: boolean
}

export interface IRoleNew extends Omit<IRole, 'role_id'> { }
export interface IRoleUpdate extends Partial<IRole> { }