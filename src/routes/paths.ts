// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/',
  MAIN: '/',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    root: ROOTS.AUTH,
    login: '/login',
    resetPassword: '/reset-password',
    verify: '/verification-link',
    forgotPassword: '/forgot-password',
  },
  // MAIN
  main: {
    root: ROOTS.MAIN,
    apps: '/applications',
  },
};
