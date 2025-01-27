import { useEffect } from 'react';
import useSWR from 'swr';
import { t } from 'i18next';

import { UserInfos, UserInfosUpdate, UserInfosUpdatePassword } from 'src/types/user-interface';
import { useUserState } from 'src/store/userState';

import { apiFetcher } from '../utils/fetchers';
import { urls } from '../utils/urls';
import { ApiError } from '../utils/apiErrors';

// ----------------------------------------------------------------------

export function usePutUserInfos() {
  const { setUserInfos } = useUserState();

  const putUserInfos = async ({ first_name, last_name, id, avatar_data }: UserInfosUpdate) => {
    try {
      const res = await apiFetcher(`${urls.userInfos.update}${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          user: {
            first_name,
            last_name,
            avatar_data,
          },
        }),
      });

      setUserInfos(res as UserInfos);
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { putUserInfos };
}

export function usePutPassword() {
  const putPassword = async ({ password, password_confirmation }: UserInfosUpdatePassword) => {
    try {
      await apiFetcher(urls.userInfos.password, {
        method: 'PUT',
        body: JSON.stringify({
          password,
          password_confirmation,
        }),
      });
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { putPassword };
}
