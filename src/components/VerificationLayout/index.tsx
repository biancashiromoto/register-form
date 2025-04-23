import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import {
  useLayoutEffect,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import { FC, ReactNode, useContext } from 'react';

const VerificationLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { isPrivateRoute } = useContext(Context);

  useLayoutEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register')
      return;
    if (!session && isPrivateRoute) {
      navigate({ to: '/unauthenticated', viewTransition: true });
    }
  }, [location.pathname, session, isPrivateRoute]);

  return <div>{children}</div>;
};

export default VerificationLayout;
