import { useEffect, useState, useRef, MutableRefObject } from 'react';
import { supabase } from '@/services/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useAuth } from '@/context/authContext';
import { useQuery } from '@tanstack/react-query';

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  currentSession: Session | null;
  initializing: boolean;
  userRef: MutableRefObject<User | null>;
  sessionRef: Session | null;
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
  const [initializing, setInitializing] = useState<boolean>(true);
  const userRef = useRef<User | null>(user);
  const sessionRef = useRef<Session | null>();

  const { data: currentSession, error } = useQuery({
    queryKey: ['fetchSession'],
    queryFn: async () => supabase.auth.getSession(),
  });

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    sessionRef.current = currentSession?.data.session;
  }, [currentSession]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
            localStorage.clear();
            window.location.href = '/login';
            return;
          }

          if (event === 'PASSWORD_RECOVERY') {
            console.log(
              'event === "PASSWORD_RECOVERY": ',
              event === 'PASSWORD_RECOVERY',
            );
            return;
          }

          setUser(session?.user ?? null);
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

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        console.log('event == "PASSWORD_RECOVERY":', event, session);
        const hashParams = new URLSearchParams();
        hashParams.set('type', 'recovery');
        sessionRef &&
          hashParams.set(
            'access_token',
            sessionRef.current?.access_token || '',
          );
        window.location.href = '/reset-password';
      }
    });
  }, []);

  return {
    user,
    setUser,
    currentSession: currentSession?.data.session || null,
    initializing,
    userRef,
    sessionRef: sessionRef.current || null,
  };
};
