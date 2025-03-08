import { AddressType, SnackbarStateType, UserType } from '@/types';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Context } from '.';
import { ContextProps } from './index.types';

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState<SnackbarStateType>({
    open: false,
    message: '',
    severity: undefined,
  });
  const [registeringUser, setRegisteringUser] = useState<UserType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState({} as AddressType);

  const value: ContextProps = {
    snackbarState,
    setSnackbarState,
    registeringUser,
    setRegisteringUser,
    selectedLocation,
    setSelectedLocation,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
