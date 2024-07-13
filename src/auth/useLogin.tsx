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
      'access-token': '',
      client: '',
      uid: '',
    });

    localStorage.removeItem(`access-token`);
    localStorage.removeItem(`uid`);
    localStorage.removeItem(`client`);
    navigate('/login');
  }

  async function login(email: string, password: string) {
    try {
      const res = await apiLogin(email, password);

      const auth: AuthToken = {
        'access-token': res.raw.headers.get('access-token')!,
        uid: res.raw.headers.get('uid')!,
        client: res.raw.headers.get('client')!,
      };

      localStorage.setItem(`access-token`, auth['access-token']);
      localStorage.setItem(`uid`, auth.uid);
      localStorage.setItem(`client`, auth.client);

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
