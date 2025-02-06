import useSWR from 'swr';
import { IUserInfos, IUserInfosData, UserInfos } from 'src/types/user-interface';

import { apiFetcher, apiFetcherRaw } from '../utils/fetchers';
import { urls } from '../utils/urls';

export function useValidateTokenApi() {
  const { error, data, isLoading } = useSWR<{ data: IUserInfosData }>(
    urls.auth.validateToken,
    apiFetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data?.data,
    isLoggued: !isLoading && !error,
    isLoading,
  };
}

export async function apiLogin(email: string, password: string) {
  const res = await apiFetcherRaw(urls.auth.signIn, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  return {
    raw: res,
    json: (await res.json()).data,
  };
}

export async function resetPassword(email: string) {
  try {
    await apiFetcher(`${urls.auth.forgotPassword}?email=${email}`, {
      method: 'GET',
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
