export interface UserInfos {
  admin: boolean;
  allow_password_change: boolean;
  c_at: string;
  company_id: {
    $oid: string;
  };
  email: string;
  first_name: string;
  global_locked_at?: string;
  global_locking_name?: string;
  last_name: string;
  locker_locked_at?: string;
  locker_locked_until?: string;
  provider: string;
  reset_password_redirect_url?: string;
  u_at: string;
  uid: string;
  id: string;
  avatar_data: IUserAvatar;
}

export interface IUserInfosData {
  id: string;
  attributes: {
    email: string;
    first_name: string;
    last_name: string;
    avatar: IUserAvatar;
    u_at: string;
    c_at: string;
  };
  type: string;
}

export interface IUserInfos {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_data: IUserAvatar;
  u_at: string;
  c_at: string;
  type: string;
}

export interface UserInfosUpdate {
  id: string;
  first_name: string;
  last_name: string;
  avatar_data: IUserAvatar;
}

export interface UserInfosUpdatePassword {
  password: string;
  password_confirmation: string;
}

interface IUserAvatar {
  id: string;
  storage: string;
  metadata: {
    filename: string;
    size: number;
    mime_type: string;
  };
  url: string;
}
