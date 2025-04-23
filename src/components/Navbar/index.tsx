import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import useAvatarUrl from '@/hooks/useAvatarUrl';
import { Avatar, Box, Skeleton, Typography, useTheme } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { Link, useLocation } from '@tanstack/react-router';
import { ComponentProps, FC, useContext } from 'react';

const Navbar: FC<ComponentProps<'nav'>> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };

  const { session, handleSignOut } = useAuth();
  const theme = useTheme();
  const { pathname } = useLocation();
  const { isPrivateRoute } = useContext(Context);
  const isLoggedIn = !!session;
  const showRegister =
    !pathname.includes('/register') && !isPrivateRoute && !isLoggedIn;
  const showLogin =
    !pathname.includes('/login') && !isPrivateRoute && !isLoggedIn;
  const showLogout = isLoggedIn;
  const navigate = useNavigate();
  const { data: avatarUrl, isLoading: isLoadingAvatar } = useAvatarUrl();

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

      {session && !isPrivateRoute && (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            position: 'absolute',
            right: '75px',
            transform: 'translateY(1px)',
            cursor: 'pointer',
          }}
          onClick={() => navigate({ to: '/profile' })}
        >
          {!isLoadingAvatar ? (
            <Avatar
              src={avatarUrl || undefined}
              sx={{
                width: 20,
                height: 20,
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            />
          ) : (
            <Skeleton variant="circular" width={20} height={20} />
          )}
          <Typography variant="caption" color="textSecondary">
            {session?.user?.email}
          </Typography>
        </Box>
      )}
    </nav>
  );
};

export default Navbar;
