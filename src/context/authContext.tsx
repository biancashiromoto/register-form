import { supabase } from '@/services/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from '@tanstack/react-router';
import {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentSession: Session | null;
  setCurrentSession: (session: Session | null) => void;
  initializing: boolean;
  userRef: MutableRefObject<User | null>;
}

const AuthContext = createContext({} as AuthContextType);

const fetchSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error?.message === 'Invalid Refresh Token: Refresh Token Not Found') {
      localStorage.clear();
      window.location.href = '/login';
      return { data: null, error: null };
    }
    return { data, error };
  } catch (error: any) {
    if (error?.message === 'Invalid Refresh Token: Refresh Token Not Found') {
      localStorage.clear();
      window.location.href = '/login';
    }
    return { data: null, error };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  const userRef = useRef<User | null>(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const { data } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    enabled: !initializing,
    retry: false,
  });

  useEffect(() => {
    if (data?.data) {
      setUser(data.data.session?.user ?? null);
      setCurrentSession(data.data.session);
    }
  }, [data]);

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
        } catch (error: any) {
          if (
            error?.message === 'Invalid Refresh Token: Refresh Token Not Found'
          ) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        currentSession,
        setCurrentSession,
        initializing,
        userRef,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
