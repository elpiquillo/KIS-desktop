import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';

import { IUserInfos } from 'src/types/user-interface';
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
      const user: IUserInfos = {
        id: res.json.id,
        email: res.json.attributes.email,
        first_name: res.json.attributes.first_name,
        last_name: res.json.attributes.last_name,
        avatar_data: res.json.attributes.avatar,
        u_at: res.json.attributes.u_at,
        c_at: res.json.attributes.c_at,
        type: res.json.type,
      };
      useUserState.getState().setUserInfos(user);

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
