import { AddressType, SnackbarStateType, UserType } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackbarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
}
