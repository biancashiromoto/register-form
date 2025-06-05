import { Context } from '@/context';
import { Box, IconButton } from '@mui/material';
import { ChangeEvent, useContext } from 'react';
import { IoMdCamera } from 'react-icons/io';
import Avatar from '../Avatar';
import { useAuthState } from '@/hooks/useAuthState';

export const AvatarUploader = () => {
  const { uploadAvatar, setAvatarPath, setIsLoadingAvatar } =
    useContext(Context);
  const { session } = useAuthState();

  if (!session) return null;

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
      <Box sx={{ position: 'relative' }}>
        <Avatar size={175} />
        <IconButton
          aria-label="Upload avatar"
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
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              setIsLoadingAvatar(true);
              if (!e.target.files?.[0]) return;
              const newAvatar = await uploadAvatar(
                e.target.files?.[0],
                session,
              );
              setAvatarPath(newAvatar ?? null);
              setIsLoadingAvatar(false);
            }}
          />
          <IoMdCamera color="white" />
        </IconButton>
      </Box>
    </Box>
  );
};
