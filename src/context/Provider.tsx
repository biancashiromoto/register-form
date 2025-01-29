import { SnackbarStateType } from '@/types';
import { FC, ReactNode, useState } from 'react';
import { Context } from '.';

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [snackBarState, setSnackbarState] = useState<SnackbarStateType>({
    open: false,
    message: '',
    status: undefined,
  });

  const value = {
    snackBarState,
    setSnackbarState,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
