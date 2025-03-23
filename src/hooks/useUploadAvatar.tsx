import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const useUploadAvatar = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const downloadImage = useCallback(
    async (path: string) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from(AVATAR_BUCKET)
          .download(path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Error downloading image');
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setAvatarUrl],
  );

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);

      if (!event.target.files || event.target.files.length === 0) {
        console.error('You must select an image to upload.');
      }

      const files = event.target.files;
      if (!files) {
        console.error('No files selected.');
        return;
      }
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        console.error('File size must be less than 2MB');
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
      console.error('Error uploading avatar', error);
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
