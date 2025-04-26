import { useAuthState } from '@/hooks/useAuthState';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { ComponentProps, FC } from 'react';
import Link from './Link';
import ProfileLink from './ProfileLink';

const Navbar: FC<ComponentProps<'nav'>> = ({ className, ...rest }) => {
  const { pathname } = useLocation();
  const showRegister = pathname.includes('/login');
  const showLogin = pathname.includes('/register');
  if (pathname === '/unauthenticated' || pathname === '/not-found') return null;

  return (
    <nav className={`navbar ${className || ''}`} data-testid="navbar" {...rest}>
      <Link
        to="/register"
        shouldShow={showRegister}
        linkText="Sign up"
        promptText="Not registered yet?"
      />
      <Link
        to="/login"
        shouldShow={showLogin}
        linkText="Sign in"
        promptText="Already registered?"
      />
      <ProfileLink />
    </nav>
  );
};

export default Navbar;
