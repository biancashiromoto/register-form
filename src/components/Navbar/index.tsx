import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC } from 'react';

interface NavbarProps extends ComponentProps<'nav'> {}

const Navbar: FC<NavbarProps> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { user, setUser } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      {!user && !currentPath.includes('/register') && (
        <p>
          Not registered yet?{' '}
          <Link to="/register" activeProps={activeProps}>
            Register
          </Link>
        </p>
      )}

      {!user && currentPath !== '/login' && (
        <p>
          Already registered?{' '}
          <Link to="/login" activeProps={activeProps}>
            Login
          </Link>
        </p>
      )}

      {user && currentPath !== '/home' && (
        <Link to="/home" activeProps={activeProps}>
          Home
        </Link>
      )}

      {user && currentPath === '/home' && (
        <Link
          to="/login"
          onClick={async () => {
            await supabase.auth.signOut();
            setUser(null);
          }}
        >
          Logout
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
