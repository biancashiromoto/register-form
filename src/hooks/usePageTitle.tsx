import { useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

type LocationType = {
  route: string;
  title: string;
};

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
  const [page, setPage] = useState({} as LocationType);

  useEffect(() => {
    const currentPage = Object.values(locations).find(
      (route) => route.route === pathname,
    );

    currentPage && setPage(currentPage);
  }, [pathname]);

  return { page };
};

export default usePageTitle;
