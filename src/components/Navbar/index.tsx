import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { Typography } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC } from 'react';

interface NavbarProps extends ComponentProps<'nav'> {}

const Navbar: FC<NavbarProps> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { user, setUser } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  if (currentPath === '/unauthenticated' || currentPath === '/not-found')
    return null;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {!user && !currentPath.includes('/register') && (
        <Typography variant="body2">
          Not registered yet?{' '}
          <Link to="/register" activeProps={activeProps}>
            Register
          </Link>
        </Typography>
      )}

      {!user && currentPath !== '/login' && (
        <Typography variant="body2">
          Already registered?{' '}
          <Link to="/login" activeProps={activeProps}>
            Login
          </Link>
        </Typography>
      )}

      {user && currentPath !== '/home' && (
        <Link to="/home" activeProps={activeProps}>
          Home
        </Link>
      )}

      {user && currentPath === '/home' && (
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
