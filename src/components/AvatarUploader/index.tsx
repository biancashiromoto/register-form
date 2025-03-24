import { Context } from '@/context';
import useUploadAvatar from '@/hooks/useUploadAvatar';
import { Avatar, Box, IconButton, Skeleton, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { IoMdCamera } from 'react-icons/io';

export const AvatarUploader = () => {
  const { avatarUrl, uploadAvatar, isLoading, error } = useUploadAvatar();
  const { setSnackbarState } = useContext(Context);

  useEffect(() => {
    if (error) {
      setSnackbarState({
        open: true,
        message: error,
        severity: 'error',
      });
    }
  }, [error]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        mb: 3,
      }}
    >
      {isLoading ? (
        <Skeleton variant="circular" width={175} height={175} />
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatarUrl || undefined}
            sx={{
              width: 175,
              height: 175,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          />
          <IconButton
            component="label"
            sx={{
              position: 'absolute',
              bottom: -5,
              right: -5,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              width: 60,
              height: 60,
            }}
            disabled={isLoading}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={uploadAvatar}
              disabled={isLoading}
            />
            <IoMdCamera color="white" />
          </IconButton>
        </Box>
      )}
      <Typography variant="caption" color="textSecondary">
        {isLoading ? 'Loading...' : ''}
      </Typography>
    </Box>
  );
};
