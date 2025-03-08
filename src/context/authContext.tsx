import { supabase } from '@/services/supabase';
import { Session, User } from '@supabase/supabase-js';
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
  return await supabase.auth.getSession();
};

export const AuthProvider = ({ children }: ReactNode) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  const userRef = useRef<User | null>(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const fetchUserSession = async () => {
      const {
        data: { session },
      } = await fetchSession();

      if (session) {
        setCurrentSession(session);
        setUser(session.user);
      }
      setInitializing(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setCurrentSession(session);
        setInitializing(false);
      },
    );
    fetchUserSession();

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
