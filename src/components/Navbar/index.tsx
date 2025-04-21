import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { Typography, useTheme } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC, useContext } from 'react';

const Navbar: FC<ComponentProps<'nav'>> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { sessionRef, handleSignOut } = useAuth();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { isPrivateRoute } = useContext(Context);
  const isLoggedIn = !!sessionRef;
  const showRegister = !pathname.includes('/register') && !isPrivateRoute;
  const showLogin = !pathname.includes('/login') && !isPrivateRoute;
  const showLogout = isLoggedIn;

  if (pathname === '/unauthenticated' || pathname === '/not-found') return null;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {showRegister && (
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

      {showLogin && (
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

      {showLogout && (
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
