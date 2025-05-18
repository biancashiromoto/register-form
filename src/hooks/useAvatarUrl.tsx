import { supabase } from '@/services/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuthState } from './useAuthState';

const useAvatarUrl = () => {
  const { session } = useAuthState();
  const avatarPath = session?.user?.user_metadata?.avatar_url;

  return useQuery({
    queryKey: ['avatar', avatarPath],
    queryFn: async () => {
      if (!avatarPath) throw new Error('No avatar path');
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(avatarPath);
      return data.publicUrl;
    },
  });
};

export default useAvatarUrl;
