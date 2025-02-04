import { ReactNode, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IUserInfos } from 'src/types/user-interface';
import { useValidateTokenApi } from '../apis/auth';
import { paths } from '../routes/paths';
import { useUserState } from '../store/userState';

export function AuthHandler() {
  const { isLoading, data, isLoggued } = useValidateTokenApi();
  const userInfosData = useMemo(
    () => ({
      id: data?.id || '',
      type: data?.type || '',
      email: data?.attributes.email || '',
      avatar_data: data?.attributes.avatar,
      c_at: data?.attributes.c_at || '',
      u_at: data?.attributes.u_at || '',
      first_name: data?.attributes.first_name || '',
      last_name: data?.attributes.last_name || '',
    }),
    [data]
  );
  const setTokenValidated = useUserState((s) => s.setTokenValidated);
  const tokenValidated = useUserState((s) => s.tokenValidated);
  const setUserInfos = useUserState((s) => s.setUserInfos);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isLoggued && !tokenValidated && location.pathname !== paths.auth.login) {
      if (
        location.pathname !== paths.auth.login &&
        location.pathname !== paths.auth.forgotPassword &&
        location.pathname !== paths.auth.verify
      ) {
        navigate('/login', { state: { from: location.pathname }, replace: true });
      }
    } else if (!isLoading && isLoggued) {
      setTokenValidated(true);
      setUserInfos(userInfosData as IUserInfos);
    }
  }, [
    isLoading,
    isLoggued,
    location.pathname,
    navigate,
    setTokenValidated,
    tokenValidated,
    setUserInfos,
    data,
    userInfosData,
  ]);

  return null;
}

/**
 * Auth protected routes
 */
export function ProtectedRoute({ element }: { element: ReactNode }) {
  const tokenValidated = useUserState((s) => s.tokenValidated);

  if (!tokenValidated) {
    return <div>{/* loading validation token ... */}</div>;
  }
  return element;
}
