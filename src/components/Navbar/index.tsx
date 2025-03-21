import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { useLogout } from '@/hooks/useLogout';
import { Typography, useTheme } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC, memo, useContext, useMemo } from 'react';
import LoadingLayer from '../LoadingLayer';

const Navbar: FC<ComponentProps<'nav'>> = ({ className, ...rest }) => {
  const { currentSession } = useAuth();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { isPrivateRoute } = useContext(Context);
  const { isLoggingOut, handleLogout } = useLogout();

  const linkStyle = useMemo(
    () => ({
      color: theme.palette.text.secondary,
    }),
    [theme.palette.text.secondary],
  );

  const showRegisterLink = useMemo(
    () => !pathname.includes('/register') && !currentSession,
    [pathname, currentSession],
  );

  const showLoginLink = useMemo(
    () => !pathname.includes('/login') && !currentSession,
    [pathname, currentSession],
  );

  const showLogout = useMemo(
    () => isPrivateRoute && !!currentSession,
    [isPrivateRoute, currentSession],
  );

  if (pathname === '/unauthenticated' || pathname === '/not-found') return null;
  if (isLoggingOut) return <LoadingLayer />;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {showRegisterLink && (
        <Typography variant="body2">
          Not registered yet?{' '}
          <Link to="/register" style={linkStyle}>
            Sign up
          </Link>
        </Typography>
      )}

      {showLoginLink && (
        <Typography variant="body2">
          Already registered?{' '}
          <Link to="/login" style={linkStyle}>
            Sign in
          </Link>
        </Typography>
      )}

      {showLogout && (
        <Typography variant="body2">
          <Link to="/login" onClick={handleLogout} style={linkStyle}>
            Sign out
          </Link>
        </Typography>
      )}
    </nav>
  );
};

export default memo(Navbar);
