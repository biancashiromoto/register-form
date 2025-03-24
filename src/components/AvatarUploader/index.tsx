import { Context } from '@/context';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import useUploadAvatar from '@/hooks/useUploadAvatar';
import { Avatar, Box, IconButton, Skeleton, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { IoMdCamera } from 'react-icons/io';

export const AvatarUploader = () => {
  const { data: avatarUrl, isLoading: isLoadingAvatar, error } = useAvatarUrl();
  const { uploadAvatar } = useUploadAvatar();
  const { setSnackbarState } = useContext(Context);

  useEffect(() => {
    if (error) {
      setSnackbarState({
        open: true,
        message: error.message,
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
      {isLoadingAvatar ? (
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
            disabled={isLoadingAvatar}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={uploadAvatar}
              disabled={isLoadingAvatar}
            />
            <IoMdCamera color="white" />
          </IconButton>
        </Box>
      )}
      <Typography variant="caption" color="textSecondary">
        {isLoadingAvatar ? 'Loading...' : ''}
      </Typography>
    </Box>
  );
};
