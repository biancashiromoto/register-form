import { AddressType, SnackbarStateType, UserType } from '@/types';
import { createTheme, useMediaQuery } from '@mui/material';
import { FC, ReactNode, useMemo, useState } from 'react';
import { Context } from '.';
import { ContextProps } from './index.types';

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkModeOn, setIsDarkModeOn] = useState(prefersDarkMode);
  const [snackbarState, setSnackbarState] = useState<SnackbarStateType>({
    open: false,
    message: '',
    severity: undefined,
  });
  const [registeringUser, setRegisteringUser] = useState<UserType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState({} as AddressType);

  const toggleTheme = () => {
    setIsDarkModeOn((prevMode) => !prevMode);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: !isDarkModeOn ? 'light' : 'dark',
        },
      }),
    [isDarkModeOn],
  );

  const value: ContextProps = {
    snackbarState,
    setSnackbarState,
    registeringUser,
    setRegisteringUser,
    selectedLocation,
    setSelectedLocation,
    isDarkModeOn,
    setIsDarkModeOn,
    toggleTheme,
    theme,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
