import { useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

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
  const normalizedPath = location.pathname.replace(/\/+$/, '');
  const [page, setPage] = useState(
    Object.values(locations).find((route) =>
      route.route.includes(normalizedPath),
    ),
  );

  useEffect(() => {
    const currentPage = Object.values(locations).find(
      (route) => route.route === pathname,
    );

    currentPage && setPage(currentPage);
  }, [pathname]);

  return { page };
};

export default usePageTitle;
