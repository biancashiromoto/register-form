import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';

export interface AuthState {
  initializing: boolean;
  sessionRef: Session | null;
  handleSignOut: () => void;
  isLoadingSignOut: boolean;
  isLoadingValidateResetLink: boolean;
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
  const [initializing, setInitializing] = useState<boolean>(true);
  const [isLoadingSignOut, setIsLoadingSignOut] = useState<boolean>(false);
  const sessionRef = useRef<Session | null>();
  const [isValidResetLink, setIsValidResetLink] = useState(false);
  const [isLoadingValidateResetLink, setIsLoadingValidateResetLink] =
    useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
            setIsLoadingSignOut(true);
            localStorage.clear();
            window.location.href = '/login';
            setIsLoadingSignOut(false);
            return;
          }

          if (event === 'PASSWORD_RECOVERY') {
            setIsValidResetLink(true);
            setIsLoadingValidateResetLink(false);
            return;
          }

          setInitializing(false);
          sessionRef.current = session;

          console.log('Auth state changed:', event, session);
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
    initializing,
    sessionRef: sessionRef.current || null,
    handleSignOut,
    isLoadingSignOut,
    isValidResetLink,
    isLoadingValidateResetLink,
  };
};
