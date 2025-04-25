import {
  getLocalStorage,
  setLocalStorage,
} from '@/helpers/localStorageManagement';
import { UserLocationType, SnackbarStateType, UserType } from '@/types';
import {
  createTheme,
  ThemeProvider,
  useMediaQuery,
  CssBaseline,
} from '@mui/material';
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
            paper: isDarkModeOn ? '#2D3748' : '#FFFFFF',
          },
          text: {
            primary: isDarkModeOn ? '#DEE4EA' : '#1D2125',
            secondary: isDarkModeOn ? '#A0AEC0' : '#4A5568',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: isDarkModeOn ? '#1D2125' : '#DEE4EA',
                color: isDarkModeOn ? '#DEE4EA' : '#1D2125',
              },
            },
          },
        },
      }),
    [isDarkModeOn],
  );

  const toggleTheme = useCallback(() => {
    setIsDarkModeOn((prevMode) => {
      const newMode = !prevMode;
      setLocalStorage('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

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
      normalizedPath,
    }),
    [
      snackbarState,
      registeringUser,
      userLocation,
      isDarkModeOn,
      theme,
      normalizedPath,
      toggleTheme,
    ],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Context.Provider value={value}>{children}</Context.Provider>
    </ThemeProvider>
  );
};

export default Provider;
