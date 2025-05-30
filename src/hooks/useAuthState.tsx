import { supabase } from '@/services/supabase';
import {
  AuthSession,
  Session,
  SignInWithPasswordCredentials,
} from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export interface AuthState {
  session: Session | null;
  signIn: (data: SignInWithPasswordCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<Session | null>;
}

const validateError = (error: Error) => {
  return (
    error?.message?.toLowerCase().includes('invalid refresh token') ||
    error?.message?.toLowerCase().includes('refresh token not found') ||
    error?.message === 'Session from session_id claim in JWT does not exist'
  );
};

export const useAuthState = (): AuthState => {
  const [session, setSession] = useState<AuthSession | null>(null);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setSession(data.session);
    }
    return data.session ?? null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setSession(null);
    window.location.href = '/login';
  };

  const signIn = async (data: SignInWithPasswordCredentials) => {
    const { data: session } = await supabase.auth.signInWithPassword(data);
    if (!session) throw new Error('Error signing in');
    setSession(session.session);
  };

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

          if (event === 'USER_UPDATED') {
            const { user } = session as AuthSession;
            if (user) {
              const { data: updatedSession } = await supabase.auth.getSession();
              setSession(updatedSession.session);
            }
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
    signIn,
    signOut,
    getSession,
    session,
  };
};
