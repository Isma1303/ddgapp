export interface IUser {
  user_id: number;
  user_nm: string;
  user_lt: string;
  email: string;
  password: string;
  is_active: boolean;
  is_manager: boolean;
}

export interface IUserNew extends Omit<IUser, "user_id"> {}
export interface IUserUpdate extends Partial<IUser> {}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserProfile {
  user_id: number;
  user_nm: string;
  user_lt: string;
  email: string;
  password: string;
  is_active: boolean;
  is_manager: boolean;
  role_id: number;
  role_nm: string;
  role_cd: string;
}
