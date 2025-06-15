import { fetchAvatar } from '@/services/user';
import { SnackbarStateType, UserLocationType, UserType } from '@/types';
import { useLocation } from '@tanstack/react-router';
import { FC, ReactNode, useMemo, useState } from 'react';
import { Context } from '.';
import { ContextProps } from './index.types';
import ThemeProvider from './ThemeProvider';
import { useQuery } from '@tanstack/react-query';

// const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
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

  const {
    data: avatar,
    isLoading,
    isPending,
    refetch: refetchAvatar,
  } = useQuery({
    queryKey: ['avatar'],
    queryFn: fetchAvatar,
  });

  const value = useMemo<ContextProps>(
    () => ({
      snackbarState,
      setSnackbarState,
      registeringUser,
      setRegisteringUser,
      userLocation,
      setUserLocation,
      normalizedPath,
      isLoadingAvatar: isLoading || isPending,
      refetchAvatar,
      avatar,
    }),
    [
      snackbarState,
      registeringUser,
      userLocation,
      normalizedPath,
      isLoading,
      isPending,
      avatar,
    ],
  );

  return (
    <ThemeProvider>
      <Context.Provider value={value}>{children}</Context.Provider>
    </ThemeProvider>
  );
};

export default Provider;
