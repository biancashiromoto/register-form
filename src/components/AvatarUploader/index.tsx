import { Context } from '@/context';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/services/supabase';
import {
  fetchSignedAvatarUrl,
  formatAvatarPath,
  uploadUserAvatar,
} from '@/services/user';
import { Avatar, Box, IconButton, Skeleton, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IoMdCamera } from 'react-icons/io';

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export const AvatarUploader = () => {
  const { setSnackbarState } = useContext(Context);
  const { session } = useAuthState();
  const queryClient = useQueryClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { isLoading, isPending } = useQuery({
    queryKey: ['avatar', 'fetchSignedAvatarUrl'],
    queryFn: async () =>
      await fetchSignedAvatarUrl(session?.user?.user_metadata?.avatar_url),
  });

  const uploadAvatar = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!session) return null;

      const file = event.target.files?.[0];
      if (!file) throw new Error('Select an image.');
      if (file.size > MAX_FILE_SIZE) throw new Error('Image larger than 8MB.');

      const path = formatAvatarPath(file, session);
      await uploadUserAvatar(path, file);

      const signedUrl = await fetchSignedAvatarUrl(path);

      if (!signedUrl) throw new Error('error');

      setAvatarUrl(signedUrl);

      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: path },
      });
      if (error) throw new Error(error.message);

      queryClient.invalidateQueries({ queryKey: ['avatar', path] });

      setSnackbarState({
        open: true,
        message: 'Avatar updated successfully!',
        severity: 'success',
      });
    },
    [session, queryClient],
  );

  useEffect(() => {
    if (!session?.user?.user_metadata?.avatar_url) return;

    const fetchAvatar = async () => {
      const publicUrl = await fetchSignedAvatarUrl(
        session.user.user_metadata.avatar_url,
      );

      if (!publicUrl) return;

      setAvatarUrl(publicUrl);
    };

    fetchAvatar();
  }, [session]);

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
      {isLoading || isPending ? (
        <Skeleton variant="circular" width={175} height={175} />
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={avatarUrl ?? undefined}
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
            disabled={isLoading || isPending}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={uploadAvatar}
              disabled={isLoading || isPending}
            />
            <IoMdCamera color="white" />
          </IconButton>
        </Box>
      )}
      {isLoading ||
        (isPending && (
          <Typography variant="caption" color="textSecondary">
            Loading...
          </Typography>
        ))}
    </Box>
  );
};
