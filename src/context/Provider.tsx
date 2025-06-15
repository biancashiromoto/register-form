import { useAuthState } from '@/hooks/useAuthState';
import { fetchAvatar } from '@/services/user';
import { SnackbarStateType, UserLocationType, UserType } from '@/types';
import { useLocation } from '@tanstack/react-router';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Context } from '.';
import { ContextProps } from './index.types';
import ThemeProvider from './ThemeProvider';

// const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const { session } = useAuthState();
  const [snackbarState, setSnackbarState] = useState<SnackbarStateType>({
    open: false,
    message: '',
    severity: undefined,
  });
  const [registeringUser, setRegisteringUser] = useState<UserType | null>(null);
  const [userLocation, setUserLocation] = useState({} as UserLocationType);
  const location = useLocation();
  const normalizedPath = useMemo(
    () => location.pathname.replace(/\/$/, ''),
    [location.pathname],
  );
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

  useEffect(() => {
    if (session) {
      setIsLoadingAvatar(true);
      const getAvatar = async () => {
        const publicUrl = await fetchAvatar();
        setAvatarPath(publicUrl ?? null);
      };
      getAvatar();
      setIsLoadingAvatar(false);
    }
  }, [session]);

  useEffect(() => {
    setAvatarPath(session?.user?.user_metadata?.avatar_url);
  }, [session]);

  const value = useMemo<ContextProps>(
    () => ({
      snackbarState,
      setSnackbarState,
      registeringUser,
      setRegisteringUser,
      userLocation,
      setUserLocation,
      normalizedPath,
      avatarPath,
      isLoadingAvatar,
      setAvatarPath,
      setIsLoadingAvatar,
    }),
    [
      snackbarState,
      registeringUser,
      userLocation,
      normalizedPath,
      avatarPath,
      isLoadingAvatar,
      setAvatarPath,
      setIsLoadingAvatar,
    ],
  );

  return (
    <ThemeProvider>
      <Context.Provider value={value}>{children}</Context.Provider>
    </ThemeProvider>
  );
};

export default Provider;
