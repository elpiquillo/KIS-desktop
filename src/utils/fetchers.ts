import { getErrorCode } from './apiErrors';
import { useUserState } from '../store/userState';

/**
 * Get raw response, usefull if you want to read headers
 */
export async function apiFetcherRaw(input: RequestInfo, init?: RequestInit) {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const getInput = () => {
    if (typeof input === 'string') {
      return `${apiUrl}${input}`;
    }
    return {
      ...(input as Request),
      url: `${apiUrl}${input}`,
    } as Request;
  };

  const { auth } = useUserState.getState();

  const res = await fetch(getInput(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      authorization: auth.authorization,
    },
  });

  if (res.status < 200 || res.status >= 300) {
    const val = (await res.json()) as any;
    if (val.errors && val.errors[0]) {
      throw new Error(getErrorCode(val.errors[0]));
    }

    if (val.length > 0) {
      throw new Error(getErrorCode(val[0]));
    }

    throw new Error(getErrorCode());
  }

  return res;
}

/**
 * Get response as JSON
 */
export async function apiFetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await apiFetcherRaw(input, init);

  // Check for status 204 (No Content) before calling res.json()
  if (res.status === 204) {
    return {} as JSON; // Return an empty object or handle it as needed
  }

  return res.json();
}

// This is a custom fetcher that can be used to fetch data with specifics methods from the API
export async function apiCustomMethodFetcher({ url, data, method }: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  return apiFetcher(url, options);
}
