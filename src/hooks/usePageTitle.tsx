import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

export const routes = {
  home: {
    route: '/authenticated/home',
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
    route: '/authenticated/profile',
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
