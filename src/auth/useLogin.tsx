import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { apiLogin } from '../apis/auth';
import { AuthToken, useUserState } from '../store/userState';

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  function logout() {
    useUserState.getState().setAuth({
      authorization: '',
    });

    localStorage.removeItem(`authorization`);
    navigate('/login');
  }

  async function login(email: string, password: string) {
    try {
      const res = await apiLogin(email, password);

      const auth: AuthToken = {
        authorization: res.raw.headers.get('Authorization')!,
      };

      localStorage.setItem(`authorization`, auth.authorization);

      useUserState.getState().setAuth(auth);
      useUserState.getState().setTokenValidated(true);
      useUserState.getState().setUserInfos(res.json);

      navigate({ pathname: location.state?.from || '/home' });
    } catch (err) {
      enqueueSnackbar('Failed to login', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });

      return false;
    }
    return true;
  }

  return { login, logout };
}
