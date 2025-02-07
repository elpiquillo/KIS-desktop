import AwsS3, { type AwsBody } from '@uppy/aws-s3';
import Uppy, { Meta } from '@uppy/core';
import { t } from 'i18next';

import { useUserState } from 'src/store/userState';
import {
  IUserInfos,
  UserInfos,
  UserInfosUpdate,
  UserInfosUpdatePassword,
} from 'src/types/user-interface';

import { ApiError } from '../utils/apiErrors';
import { apiFetcher } from '../utils/fetchers';
import { urls } from '../utils/urls';

// ----------------------------------------------------------------------

export function usePutUserInfos() {
  const { setUserInfos } = useUserState();

  const putUserInfos = async ({ first_name, last_name, id, avatar_data }: UserInfosUpdate) => {
    try {
      // const res = await apiFetcher(`${urls.userInfos.update}${id}`, {
      const res = await apiFetcher(`${urls.userInfos.updateUser}`, {
        method: 'PUT',
        body: JSON.stringify({
          user: {
            first_name,
            last_name,
            avatar_data,
          },
        }),
      });

      setUserInfos(res as IUserInfos);
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

export function useUppyToUpdateProfilePicture() {
  const uppy = new Uppy<Meta, AwsBody>({ autoProceed: true }).use(AwsS3, {
    endpoint: `${process.env.REACT_APP_API_BASE_URL}/users`,
    headers: {
      Authorization: `${localStorage.getItem('authorization')}`,
    },
  });
  return uppy;
}
