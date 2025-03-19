import {
  getLocalStorage,
  setLocalStorage,
} from '@/helpers/localStorageManagement';
import { SnackbarStateType } from '@/types';
import { privateRoutes } from '@/utils/commons/privateRoutes';
import { createTheme, useMediaQuery } from '@mui/material';
import { useLocation } from '@tanstack/react-router';
import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
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
  const location = useLocation();
  const normalizedPath = location.pathname.replace(/\/+$/, '');
  const isPrivateRoute = privateRoutes.includes(normalizedPath);

  const toggleTheme = useCallback(() => {
    setIsDarkModeOn((prevMode: boolean) => {
      const newMode = !prevMode;
      setLocalStorage('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, [isDarkModeOn]);

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

  const value: ContextProps = {
    snackbarState,
    setSnackbarState,
    isDarkModeOn,
    setIsDarkModeOn,
    toggleTheme,
    theme,
    isPrivateRoute,
    normalizedPath,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
