import { useAuthState } from '@/hooks/useAuthState';
import { fetchAvatar } from '@/services/user';
import { SnackbarStateType, UserLocationType, UserType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { Context } from '.';
import { ContextProps, SnackbarEventType } from './index.types';
import ThemeProvider from './ThemeProvider';

const INITIAL_SNACKBAR_STATE: SnackbarStateType = {
  open: false,
  message: '',
  severity: undefined,
};

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const { session } = useAuthState();
  const [snackbarState, setSnackbarState] = useState<SnackbarStateType>(
    INITIAL_SNACKBAR_STATE,
  );
  const [registeringUser, setRegisteringUser] = useState<UserType | null>(null);
  const [userLocation, setUserLocation] = useState({} as UserLocationType);
  const location = useLocation();
  const normalizedPath = useMemo(
    () => location.pathname.replace(/\/$/, ''),
    [location.pathname],
  );

  const handleOpenSnackbar = useCallback(
    (event: SnackbarEventType) => {
      setSnackbarState({
        open: true,
        message: event.message,
        severity: event.severity,
      });
    },
    [setSnackbarState],
  );

  const handleCloseSnackbar = useCallback(
    () => setSnackbarState(INITIAL_SNACKBAR_STATE),
    [setSnackbarState],
  );

  const {
    data: avatar,
    isLoading,
    isPending,
    refetch: refetchAvatar,
  } = useQuery({
    queryKey: ['avatar'],
    queryFn: fetchAvatar,
    enabled: !!session,
  });

  const value = useMemo<ContextProps>(
    () => ({
      snackbarState,
      handleOpenSnackbar,
      handleCloseSnackbar,
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
