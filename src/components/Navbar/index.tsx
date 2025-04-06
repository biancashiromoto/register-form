import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { Typography, useTheme } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC, useContext } from 'react';
import LoadingLayer from '../LoadingLayer';

const Navbar: FC<ComponentProps<'nav'>> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { sessionRef, handleSignOut, isLoadingSignOut } = useAuth();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { isPrivateRoute } = useContext(Context);

  if (pathname === '/unauthenticated' || pathname === '/not-found') return null;

  if (isLoadingSignOut) return <LoadingLayer />;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {!pathname.includes('/register') && !sessionRef && (
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

      {!pathname.includes('/login') && !sessionRef && (
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

      {isPrivateRoute && sessionRef && (
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
