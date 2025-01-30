import { SnackbarStateType } from '@/types';
import { FC, ReactNode, useState } from 'react';
import { Context } from '.';
import { ContextProps } from './index.types';

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState<SnackbarStateType>({
    open: false,
    message: '',
    severity: undefined,
  });

  const value: ContextProps = {
    snackbarState,
    setSnackbarState,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default Provider;
