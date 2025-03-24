import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

const locations = {
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
};

const usePageTitle = () => {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '');

  const page = useMemo(() => {
    return Object.values(locations).find(
      (route) => route.route === normalizedPath,
    );
  }, [normalizedPath]);

  return { page };
};

export default usePageTitle;
