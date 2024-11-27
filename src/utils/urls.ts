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
    menu: '/users/menus',
    page: {
      get: '/users/pages',
    },
  },
  dataHandlers: {
    list: '/users/data_handlers/index',
    create: '/users/data_handlers',
    get: '/users/data_handlers/',
    update: '/users/data_handlers/',
  },
  userInfos: {
    update: '/users/companies_accounts/',
    password: '/user_auth/password',
  },
  dashboardAcceses: {
    update: '/users/dashboard_accesses/',
  },
  profile: {},
};
