import {
  useEffect,
  useState,
  useRef,
  MutableRefObject,
  useContext,
} from 'react';
import { supabase } from '@/services/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { Context } from '@/context';

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  currentSession: Session | null;
  initializing: boolean;
  userRef: MutableRefObject<User | null>;
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
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [isLoadingSignOut, setIsLoadingSignOut] = useState<boolean>(false);
  const userRef = useRef<User | null>(user);
  const sessionRef = useRef<Session | null>();
  const [isValidResetLink, setIsValidResetLink] = useState(false);
  const [isLoadingValidateResetLink, setIsLoadingValidateResetLink] =
    useState(false);
  const { normalizedPath } = useContext(Context);

  const { data: currentSession } = useQuery({
    queryKey: ['fetchSession'],
    queryFn: async () => supabase.auth.getSession(),
  });

  const handleSignOut = async () => {
    setIsLoadingSignOut(true);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      throw new Error();
    } finally {
      setIsLoadingSignOut(false);
    }
  };

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
            setIsLoadingSignOut(true);
            localStorage.clear();
            window.location.href = '/login';
            setIsLoadingSignOut(false);
            return;
          }

          if (
            event === 'PASSWORD_RECOVERY' &&
            normalizedPath === '/reset-password'
          ) {
            setIsValidResetLink(true);
            setIsLoadingValidateResetLink(false);
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

  return {
    user,
    setUser,
    currentSession: currentSession?.data.session || null,
    initializing,
    userRef,
    sessionRef: sessionRef.current || null,
    handleSignOut,
    isLoadingSignOut,
    isValidResetLink,
    isLoadingValidateResetLink,
  };
};
