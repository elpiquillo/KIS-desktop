import { UserInfos } from 'src/types/user-interface';
import { create } from 'zustand';

export interface AuthToken {
  'access-token': string;
  uid: string;
  client: string;
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
    'access-token': localStorage.getItem('access-token') || '',
    uid: localStorage.getItem('uid') || '',
    client: localStorage.getItem('client') || '',
  },
  setAuth: (value) => set(() => ({ auth: value })),
  tokenValidated: false,
  setTokenValidated: (value) => set(() => ({ tokenValidated: value })),
  setUserInfos: (value) => set(() => ({ userInfos: value })),
}));
