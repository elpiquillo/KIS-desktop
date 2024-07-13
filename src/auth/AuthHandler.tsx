import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useValidateTokenApi } from '../apis/auth';
import { useUserState } from '../store/userState';
import { paths } from '../routes/paths';

export function AuthHandler() {
  const { isLoading, data, isLoggued } = useValidateTokenApi();
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
      setUserInfos(data);
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
