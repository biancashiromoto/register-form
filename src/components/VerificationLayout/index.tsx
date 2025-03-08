import { useAuth } from '@/context/authContext';
import {
  useLayoutEffect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { FC, ReactNode } from 'react';

const VerificationLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, initializing } = useAuth();
  const publicRoutes = ['/login', '/unauthenticated'];
  const isRegisterRoute = location.pathname.includes('/register');
  const isPublicRoute =
    publicRoutes.includes(location.pathname) || isRegisterRoute;

  useLayoutEffect(() => {
    if (location.pathname === '/' || initializing) return;
    if (!user && !isPublicRoute) {
      navigate({ to: '/unauthenticated', replace: true });
    }
  }, [user, location.pathname, navigate]);

  return <div>{children}</div>;
};

export default VerificationLayout;
