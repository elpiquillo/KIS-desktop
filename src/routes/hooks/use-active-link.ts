import { matchPath, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string, deep = true): ReturnType {
  const { pathname } = useLocation();

  const isIndex = path === '/' && pathname === '/';

  if (path && path === '/') {
    return pathname === '/' || pathname === '/home';
  }

  const normalActive = path ? !!matchPath({ path, end: false }, pathname) : false;

  const deepActive = path ? !!matchPath({ path, end: false }, pathname) : false;

  return deep ? deepActive : normalActive;
}
