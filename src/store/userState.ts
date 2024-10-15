import { UserInfos } from 'src/types/user-interface';
import { create } from 'zustand';

export interface AuthToken {
  authorization: string;
}

interface UserState {
  auth: AuthToken;
  setAuth: (auth: AuthToken) => void;
  tokenValidated: boolean;
  setTokenValidated: (val: boolean) => void;
  userInfos?: UserInfos;
  setUserInfos: (val: UserInfos | undefined) => void;
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
