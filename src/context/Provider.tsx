import {
  getLocalStorage,
  setLocalStorage,
} from '@/helpers/localStorageManagement';
import { UserLocationType, SnackbarStateType, UserType } from '@/types';
import { privateRoutes } from '@/utils/commons/privateRoutes';
import { createTheme, useMediaQuery } from '@mui/material';
import { useLocation } from '@tanstack/react-router';
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Context } from '.';
import { ContextProps } from './index.types';

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkModeOn, setIsDarkModeOn] = useState<boolean>(() => {
    const storedTheme = getLocalStorage('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return prefersDarkMode;
  });
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
  const isPrivateRoute = privateRoutes.includes(normalizedPath);

  useEffect(
    () =>
      setSnackbarState({
        open: false,
        message: '',
        severity: undefined,
      }),
    [normalizedPath],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkModeOn ? 'dark' : 'light',
          background: {
            default: isDarkModeOn ? '#1D2125' : '#DEE4EA',
          },
          text: {
            primary: !isDarkModeOn ? '#red' : '#DEE4EA',
          },
        },
      }),
    [isDarkModeOn],
  );

  const toggleTheme = useCallback(() => {
    setIsDarkModeOn((prevMode: boolean) => {
      const newMode = !prevMode;
      setLocalStorage('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, [setIsDarkModeOn]);

  const value = useMemo<ContextProps>(
    () => ({
      snackbarState,
      setSnackbarState,
      registeringUser,
      setRegisteringUser,
      userLocation,
      setUserLocation,
      isDarkModeOn,
      setIsDarkModeOn,
      toggleTheme,
      theme,
      isPrivateRoute,
      normalizedPath,
    }),
    [
      snackbarState,
      registeringUser,
      userLocation,
      isDarkModeOn,
      theme,
      isPrivateRoute,
      normalizedPath,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
