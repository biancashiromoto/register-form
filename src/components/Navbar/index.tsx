import { useAuthState } from '@/hooks/useAuthState';
import useAvatarUrl from '@/hooks/useAvatarUrl';
import { Avatar, Box, Skeleton, Typography, useTheme } from '@mui/material';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { ComponentProps, FC } from 'react';

const Navbar: FC<ComponentProps<'nav'>> = ({ className, ...rest }) => {
  const activeProps = { style: { fontWeight: 'bold' } };
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: avatarUrl, isLoading: isLoadingAvatar } = useAvatarUrl();
  const { session, signOut } = useAuthState();
  const isAuthenticatedRoute = pathname.includes('/authenticated');
  const showRegister =
    !pathname.includes('/register') && !session && !isAuthenticatedRoute;
  const showLogin =
    !pathname.includes('/login') && !session && !isAuthenticatedRoute;
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

      {session && (
        <Typography variant="body2">
          <Link
            to="/login"
            onClick={signOut}
            style={{
              color: theme.palette.text.secondary,
            }}
          >
            Sign out
          </Link>
        </Typography>
      )}

      {session && (
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
          onClick={() => navigate({ to: '/authenticated/profile' })}
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
