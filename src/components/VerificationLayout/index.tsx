import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import {
  useLayoutEffect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { FC, ReactNode, useContext } from 'react';
import LoadingLayer from '../LoadingLayer';

const VerificationLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionRef, initializing } = useAuth();
  const { isPrivateRoute } = useContext(Context);

  useLayoutEffect(() => {
    if (
      initializing ||
      location.pathname === '/login' ||
      location.pathname === '/register'
    )
      return;
    if (!sessionRef && isPrivateRoute) {
      navigate({ to: '/unauthenticated', viewTransition: true });
    }
  }, [location.pathname, sessionRef, initializing, isPrivateRoute]);

  if (initializing) return <LoadingLayer />;

  return <div>{children}</div>;
};

export default VerificationLayout;
