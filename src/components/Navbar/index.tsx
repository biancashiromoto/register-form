import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { Typography, useTheme } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC, useContext, useMemo } from 'react';

const Navbar: FC<ComponentProps<'nav'>> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { sessionRef, handleSignOut } = useAuth();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { isPrivateRoute } = useContext(Context);

  const shouldShowRegisterLink = useMemo(
    () => !pathname.includes('/register') && !sessionRef,
    [sessionRef, pathname],
  );

  const shouldShowLoginLink = useMemo(
    () => !pathname.includes('/login') && !sessionRef,
    [sessionRef, pathname],
  );

  const shouldShowLogoutLink = useMemo(
    () => (isPrivateRoute && sessionRef) || pathname.includes('reset-password'),
    [sessionRef, pathname],
  );

  if (pathname === '/unauthenticated' || pathname === '/not-found') return null;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {shouldShowRegisterLink && (
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

      {shouldShowLoginLink && (
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

      {shouldShowLogoutLink && (
        <Typography variant="body2">
          <Link
            to="/login"
            onClick={handleSignOut}
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
