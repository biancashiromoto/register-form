import { supabase } from '@/services/supabase';
import { useAuth } from '@/context/authContext';
import { useQuery } from '@tanstack/react-query';

const useAvatarUrl = () => {
  const { sessionRef } = useAuth();
  const avatarPath = sessionRef?.user?.user_metadata?.avatar_url;

  return useQuery({
    queryKey: ['avatar-url', avatarPath],
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
