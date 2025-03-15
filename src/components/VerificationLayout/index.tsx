import { useAuth } from '@/context/authContext';
import {
  useLayoutEffect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { FC, ReactNode, useContext } from 'react';
import LoadingLayer from '../LoadingLayer';
import { Context } from '@/context';

const VerificationLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentSession, initializing } = useAuth();
  const { isPrivateRoute } = useContext(Context);

  useLayoutEffect(() => {
    if (initializing) return;
    if (!currentSession && isPrivateRoute) {
      navigate({ to: '/unauthenticated', replace: true });
    }
  }, [location.pathname, currentSession, initializing, isPrivateRoute]);

  if (initializing) return <LoadingLayer />;

  return <div>{children}</div>;
};

export default VerificationLayout;
