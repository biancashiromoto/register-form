import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const useUploadAvatar = () => {
  const { user } = useAuth();
  const { setSnackbarState } = useContext(Context);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const downloadImage = async (path: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(AVATAR_BUCKET)
        .download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
      setIsLoading(false);
    } catch (error) {
      setSnackbarState({
        open: true,
        message: 'Error downloading image',
        severity: 'error',
      });
    }
  };

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setSnackbarState({
          open: true,
          message: 'File size must be less than 2MB',
          severity: 'error',
        });
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
    } catch (error: any) {
      setSnackbarState({
        open: true,
        message: 'Error uploading avatar',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_metadata.avatar_url) {
      downloadImage(user.user_metadata.avatar_url);
    }
  }, [user]);

  return {
    avatarUrl,
    isLoading,
    uploadAvatar,
  };
};

export default useUploadAvatar;
