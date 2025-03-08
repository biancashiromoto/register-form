import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';
import { ReactNode } from '@tanstack/react-router';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
  initializing: boolean;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: ReactNode) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        setInitializing(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setInitializing(false);
      },
    );

    fetchUser();
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('user: ', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
