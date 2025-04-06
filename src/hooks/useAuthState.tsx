import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/services/supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  currentSession: Session | null;
  setCurrentSession: (session: Session | null) => void;
  initializing: boolean;
  userRef: React.MutableRefObject<User | null>;
}

const validateError = (error: Error) => {
  return (
    error?.message?.toLowerCase().includes('invalid refresh token') ||
    error?.message?.toLowerCase().includes('refresh token not found') ||
    error?.message === 'Session from session_id claim in JWT does not exist'
  );
};

export const useAuthState = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const userRef = useRef<User | null>(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error && validateError(error)) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }
        setUser(data.session?.user ?? null);
        setCurrentSession(data.session);
      } catch (error: any) {
        if (validateError(error)) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } finally {
        setInitializing(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'TOKEN_REFRESHED' && !session) {
            localStorage.clear();
            window.location.href = '/login';
            return;
          }
          setUser(session?.user ?? null);
          setCurrentSession(session);
          setInitializing(false);
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

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event teste:', event, session);
      if (event == 'PASSWORD_RECOVERY') {
        window.location.href = '/password-reset';
      }
    });
  }, []);

  return {
    user,
    setUser,
    currentSession,
    setCurrentSession,
    initializing,
    userRef,
  };
};
