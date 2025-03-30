import { createContext, useContext } from 'react';
import { ReactNode } from 'react';
import { useAuthState, AuthState } from '@/hooks/useAuthState';

const AuthContext = createContext({} as AuthState);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
