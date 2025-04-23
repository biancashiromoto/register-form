import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
import { useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export interface AuthState {
  session: Session | null;
  handleSignOut: () => void;
  isValidResetLink: boolean;
}

const validateError = (error: Error) => {
  return (
    error?.message?.toLowerCase().includes('invalid refresh token') ||
    error?.message?.toLowerCase().includes('refresh token not found') ||
    error?.message === 'Session from session_id claim in JWT does not exist'
  );
};

export const useAuthState = (): AuthState => {
  const [session, setSession] = useState<Session | null>(null);
  const [isValidResetLink, setIsValidResetLink] = useState(false);

  const { pathname } = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();
  }, [pathname]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
            localStorage.clear();
            setSession(null);
            window.location.href = '/login';
            return;
          }

          if (event === 'PASSWORD_RECOVERY') {
            setIsValidResetLink(true);
            return;
          }

          console.log('Auth state changed:', event, session);
          setSession(session);
        } catch (error: any) {
          if (validateError(error)) {
            console.log('Auth state error:', error);
            localStorage.clear();
            window.location.href = '/login';
          }
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    handleSignOut,
    isValidResetLink,
  };
};
