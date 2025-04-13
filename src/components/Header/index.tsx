import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { Avatar, Box, Container, Skeleton, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import Navbar from '../Navbar';
import ToggleThemeSwitch from '../ToggleThemeSwitch';
import useAvatarUrl from '@/hooks/useAvatarUrl';

const Header = () => {
  const { toggleTheme, isDarkModeOn } = useContext(Context);
  const { sessionRef } = useAuth();
  const navigate = useNavigate();
  const { data: avatarUrl, isLoading: isLoadingAvatar } = useAvatarUrl();

  return (
    <Container>
      <Box
        component="header"
        style={{ display: 'flex', alignItems: 'center', height: '3em' }}
      >
        <ToggleThemeSwitch
          aria-label={`${isDarkModeOn ? 'Deactivate' : 'Activate'} dark mode`}
          onChange={toggleTheme}
          checked={isDarkModeOn}
        />
        {sessionRef && (
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
              {sessionRef?.user?.email}
            </Typography>
          </Box>
        )}
        <Navbar style={{ position: 'absolute', right: '12px' }} />
      </Box>
    </Container>
  );
};

export default Header;
