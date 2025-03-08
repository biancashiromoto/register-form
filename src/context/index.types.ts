import { AddressType, SnackbarStateType, UserType } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackbarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
  registeringUser: UserType | null;
  setRegisteringUser: Dispatch<SetStateAction<UserType | null>>;
  selectedLocation: AddressType;
  setSelectedLocation: Dispatch<SetStateAction<AddressType>>;
}
