import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { useCallback, useState } from 'react';

export const useLogout = () => {
  const { setUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggingOut(false);
  }, [setUser]);

  return { isLoggingOut, handleLogout };
};
