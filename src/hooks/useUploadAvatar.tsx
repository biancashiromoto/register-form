import { supabase } from '@/services/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useCallback } from 'react';
import { useAuthState } from './useAuthState';

export const fetchAvatarUrl = async (path: string): Promise<string> => {
  const { data, error } = await supabase.storage.from('avatars').download(path);

  if (error || !data) {
    throw new Error(error?.message ?? 'Error downloading avatar');
  }

  return URL.createObjectURL(data);
};

const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const useUploadAvatar = () => {
  const { session } = useAuthState();
  const queryClient = useQueryClient();

  const uploadAvatar = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) throw new Error('Select an image.');

      const file = files[0];
      if (file.size > MAX_FILE_SIZE) throw new Error('Image larger than 8MB.');

      const ext = file.name.split('.').pop();
      const path = `${session?.user?.id}/${session?.user?.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      await supabase.auth.updateUser({ data: { avatar_url: path } });

      queryClient.invalidateQueries({ queryKey: ['avatar'] });
    },
    [session, queryClient],
  );

  return {
    uploadAvatar,
  };
};

export default useUploadAvatar;
