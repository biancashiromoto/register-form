import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({} as any);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      user && setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
