import { create } from 'zustand';
import { IUserInfos, UserInfos } from 'src/types/user-interface';

export interface AuthToken {
  authorization: string;
}

interface UserState {
  auth: AuthToken;
  setAuth: (auth: AuthToken) => void;
  tokenValidated: boolean;
  setTokenValidated: (val: boolean) => void;
  userInfos?: IUserInfos;
  setUserInfos: (val: IUserInfos | undefined) => void;
}

export const useUserState = create<UserState>()((set) => ({
  auth: {
    authorization: localStorage.getItem('authorization') || '',
  },
  setAuth: (value) => set(() => ({ auth: value })),
  tokenValidated: false,
  setTokenValidated: (value) => set(() => ({ tokenValidated: value })),
  setUserInfos: (value) => set(() => ({ userInfos: value })),
}));
