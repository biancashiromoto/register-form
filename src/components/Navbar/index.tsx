import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { Typography, useTheme } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC, useContext, useState } from 'react';
import LoadingLayer from '../LoadingLayer';

const Navbar: FC<ComponentProps<'nav'>> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { setUser, currentSession } = useAuth();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { isPrivateRoute } = useContext(Context);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (pathname === '/unauthenticated' || pathname === '/not-found') return null;

  if (isLoggingOut) return <LoadingLayer />;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {!pathname.includes('/register') && !currentSession && (
        <Typography variant="body2">
          Not registered yet?{' '}
          <Link
            to="/register"
            activeProps={activeProps}
            style={{
              color: theme.palette.text.secondary,
            }}
          >
            Sign up
          </Link>
        </Typography>
      )}

      {!pathname.includes('/login') && !currentSession && (
        <Typography variant="body2">
          Already registered?{' '}
          <Link
            to="/login"
            activeProps={activeProps}
            style={{
              color: theme.palette.text.secondary,
            }}
          >
            Sign in
          </Link>
        </Typography>
      )}

      {isPrivateRoute && currentSession && (
        <Typography variant="body2">
          <Link
            to="/login"
            onClick={async () => await supabase.auth.signOut()}
            style={{
              color: theme.palette.text.secondary,
            }}
          >
            Sign out
          </Link>
        </Typography>
      )}
    </nav>
  );
};

export default Navbar;
