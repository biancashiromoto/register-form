import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

export const routes = {
  home: {
    route: '/home',
    title: 'Home',
  },
  login: {
    route: '/login',
    title: 'Login',
  },
  register: {
    route: '/register',
    title: 'Register',
  },
  profile: {
    route: '/profile',
    title: 'Profile',
  },
  resetPassword: {
    route: '/reset-password',
    title: 'Reset password',
  },
};

const usePageTitle = () => {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '');

  const page = useMemo(() => {
    return Object.values(routes).find(
      (route) => route.route === normalizedPath,
    );
  }, [normalizedPath]);

  return { page };
};

export default usePageTitle;
