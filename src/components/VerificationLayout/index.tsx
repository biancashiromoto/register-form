import { useAuth } from '@/context/authContext';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { ReactNode, FC, useEffect } from 'react';

const VerificationLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const publicRoutes = ['/login', '/unauthenticated'];
  const isRegisterRoute = location.pathname.includes('/register');
  const isPublicRoute =
    publicRoutes.includes(location.pathname) || isRegisterRoute;

  useEffect(() => {
    if (!user && !isPublicRoute) {
      navigate({ to: '/unauthenticated', replace: true });
    }
  }, [user, location.pathname]);

  return <div>{children}</div>;
};

export default VerificationLayout;
