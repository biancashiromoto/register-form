import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { Typography } from '@mui/material';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC, useContext } from 'react';

interface NavbarProps extends ComponentProps<'nav'> {}

const Navbar: FC<NavbarProps> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { setUser } = useAuth();
  const { pathname } = useLocation();
  const { isPrivateRoute } = useContext(Context);

  if (pathname === '/unauthenticated' || pathname === '/not-found') return null;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {pathname !== '/register' && !isPrivateRoute && (
        <Typography variant="body2">
          Not registered yet?{' '}
          <Link to="/register" activeProps={activeProps}>
            Sign up
          </Link>
        </Typography>
      )}

      {pathname !== '/login' && !isPrivateRoute && (
        <Typography variant="body2">
          Already registered?{' '}
          <Link to="/login" activeProps={activeProps}>
            Sign in
          </Link>
        </Typography>
      )}

      {isPrivateRoute && (
        <Typography variant="body2">
          <Link
            to="/login"
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
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
