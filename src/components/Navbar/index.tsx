import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { privateRoutes } from '@/utils/commons/privateRoutes';
import { Typography } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC, useContext } from 'react';

interface NavbarProps extends ComponentProps<'nav'> {}

const Navbar: FC<NavbarProps> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { user, setUser } = useAuth();
  const { pathname } = useLocation();
  const { isPrivateRoute } = useContext(Context);

  if (pathname === '/unauthenticated' || pathname === '/not-found') return null;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {pathname !== '/register' && !privateRoutes.includes(pathname) && (
        <Typography variant="body2">
          Not registered yet?{' '}
          <Link to="/register" activeProps={activeProps}>
            Register
          </Link>
        </Typography>
      )}

      {pathname !== '/login' && !privateRoutes.includes(pathname) && (
        <Typography variant="body2">
          Already registered?{' '}
          <Link to="/login" activeProps={activeProps}>
            Login
          </Link>
        </Typography>
      )}

      {/* 
      {user && pathname !== '/home' && (
        <Link to="/home" activeProps={activeProps}>
          Home
        </Link>
      )} */}

      {!isPrivateRoute && (
        <Typography variant="body2">
          <Link
            to="/login"
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
          >
            Logout
          </Link>
        </Typography>
      )}
    </nav>
  );
};

export default Navbar;
