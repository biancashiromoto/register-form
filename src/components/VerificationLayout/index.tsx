import { useAuth } from '@/context/authContext';
import {
  useLayoutEffect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { FC, ReactNode } from 'react';
import LoadingLayer from '../LoadingLayer';

export const privateRoutes = ['/home'];

const VerificationLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentSession, initializing } = useAuth();
  const isPrivateRoute = privateRoutes.includes(location.pathname);

  useLayoutEffect(() => {
    if (initializing) return;
    if (!currentSession && isPrivateRoute) {
      navigate({ to: '/unauthenticated', replace: true });
    }
  }, [location.pathname, currentSession, initializing, isPrivateRoute]);

  if (initializing) {
    return <LoadingLayer open={initializing} />;
  }

  return <div>{children}</div>;
};

export default VerificationLayout;
