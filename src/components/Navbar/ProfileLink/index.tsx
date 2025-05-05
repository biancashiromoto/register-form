import { useAuthState } from '@/hooks/useAuthState';
import useAvatarUrl from '@/hooks/useAvatarUrl';
import { Box, Avatar, Skeleton, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import Link from '../Link';

export const SkeletonProfileLink = () => (
  <Box
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      position: 'absolute',
      right: '75px',
      transform: 'translateY(1px)',
    }}
  >
    <Skeleton
      data-testid="skeleton-avatar"
      variant="circular"
      width={20}
      height={20}
    />
    <Skeleton
      data-testid="skeleton-email"
      variant="text"
      width={100}
      height={20}
    />
  </Box>
);

const ProfileLink = () => {
  const navigate = useNavigate();
  const { data: avatarUrl, isLoading: isLoadingAvatar } = useAvatarUrl();
  const { session, signOut } = useAuthState();
  return (
    session &&
    (isLoadingAvatar ? (
      <SkeletonProfileLink />
    ) : (
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          right: '75px',
          cursor: 'pointer',
        }}
        onClick={() => navigate({ to: '/profile' })}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transform: 'translateY(1px)',
          }}
        >
          <Avatar
            src={avatarUrl ?? undefined}
            sx={{
              width: 20,
              height: 20,
              border: '2px solid',
              borderColor: 'primary.main',
              transform: 'translateY(-2px)',
            }}
            alt={`${session.user.user_metadata.first_name}'s avatar`}
          />
          <Typography variant="caption" color="textSecondary">
            {session?.user?.email}
          </Typography>
        </Box>

        <Link
          shouldShow={!!session}
          onClick={signOut}
          promptText=""
          linkText="Sign out"
        />
      </Box>
    ))
  );
};

export default ProfileLink;
