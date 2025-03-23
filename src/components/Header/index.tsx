import { useContext } from 'react';
import Navbar from '../Navbar';
import { ToggleThemeSwitch } from '../ToggleThemeSwitch';
import { Context } from '@/context';
import { Avatar, Box, Container, Skeleton, Typography } from '@mui/material';
import useUploadAvatar from '@/hooks/useUploadAvatar';
import { useAuth } from '@/context/authContext';
import { useNavigate } from '@tanstack/react-router';

const Header = () => {
  const { toggleTheme, isDarkModeOn } = useContext(Context);
  const { avatarUrl } = useUploadAvatar();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        component="header"
        style={{ display: 'flex', alignItems: 'center', height: '3em' }}
      >
        <ToggleThemeSwitch onChange={toggleTheme} checked={isDarkModeOn} />
        {user && (
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
            {avatarUrl ? (
              <Avatar
                src={avatarUrl || ''}
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
              {user?.email}
            </Typography>
          </Box>
        )}
        <Navbar style={{ position: 'absolute', right: '12px' }} />
      </Box>
    </Container>
  );
};

export default Header;
