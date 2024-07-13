export const API_BASE_URL = 'https://api.getkis.io/api/v1';

export const urls = {
  auth: {
    signIn: '/user_auth/sign_in',
    signOut: '/user_auth/sign_out',
    forgotPassword: '/user_auth/password/new',
    resetPassword: '/user_auth/password',
    validateToken: '/user_auth/validate_token',
  },
  dashboards: {
    list: '/users/dashboard_accesses',
    menu: {},
    page: {},
  },
  dataHandlers: {
    list: '/companies/data_handlers/index',
    create: '/companies/data_handlers',
    get: '/companies/data_handlers/',
    update: '/companies/data_handlers/',
  },
  dashboardAcceses: {},
  profile: {},
};
