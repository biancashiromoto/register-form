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
  const { currentSession, initializing } = useAuth();
  const publicRoutes = ['/login', '/unauthenticated'];
  const isRegisterRoute = location.pathname.includes('/register');
  const isPublicRoute =
    publicRoutes.includes(location.pathname) ||
    isRegisterRoute ||
    location.pathname === '/';

  useLayoutEffect(() => {
    if (initializing) return;
    if (!currentSession && !isPublicRoute) {
      navigate({ to: '/unauthenticated', replace: true });
    }
  }, [location.pathname, currentSession, initializing, isPublicRoute]);

  if (initializing) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default VerificationLayout;
