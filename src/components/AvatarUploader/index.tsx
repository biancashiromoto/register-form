import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { Box, Avatar, IconButton, Typography, Skeleton } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { IoMdCamera } from 'react-icons/io';

const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const AvatarUploader = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.user_metadata.avatar_url) {
      downloadImage(user.user_metadata.avatar_url);
      setIsLoading(false);
    }
  }, [user]);

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(AVATAR_BUCKET)
        .download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be less than 2MB');
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${user?.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      await supabase.auth.updateUser({
        data: { avatar_url: filePath },
      });

      downloadImage(filePath);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error uploading avatar:', error.message);
      } else {
        console.error('Error uploading avatar:', error);
      }
    } finally {
      setUploading(false);
    }
  };

  if (isLoading)
    return <Skeleton variant="circular" width={100} height={100} />;

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
        <Avatar
          src={avatarUrl || undefined}
          sx={{
            width: 100,
            height: 100,
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
          }}
          disabled={uploading}
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
          <IoMdCamera color="white" />
        </IconButton>
      </Box>
      <Typography variant="caption" color="textSecondary">
        {uploading ? 'Uploading...' : 'Click to upload avatar'}
      </Typography>
    </Box>
  );
};
