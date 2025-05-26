import Avatar from '@/components/Avatar';
import { useAuthState } from '@/hooks/useAuthState';
import { Box, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import Link from '../Link';

const ProfileLink = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuthState();

  return (
    session && (
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
          <Avatar />
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
    )
  );
};

export default ProfileLink;
