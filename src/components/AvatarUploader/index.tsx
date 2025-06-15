import { Context } from '@/context';
import { Box, IconButton } from '@mui/material';
import { ChangeEvent, useContext } from 'react';
import { IoMdCamera } from 'react-icons/io';
import Avatar from '../Avatar';
import { uploadAvatar } from '@/services/user';

export const AvatarUploader = () => {
  const { refetchAvatar } = useContext(Context);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    await uploadAvatar(e.target.files?.[0]);
    refetchAvatar();
  };

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
            onChange={handleAvatarUpload}
          />
          <IoMdCamera color="white" />
        </IconButton>
      </Box>
    </Box>
  );
};
