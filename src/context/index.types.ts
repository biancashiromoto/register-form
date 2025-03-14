import { AddressType, SnackbarStateType, UserType } from '@/types';
import { Theme } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackbarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
  registeringUser: UserType | null;
  setRegisteringUser: Dispatch<SetStateAction<UserType | null>>;
  selectedLocation: AddressType;
  setSelectedLocation: Dispatch<SetStateAction<AddressType>>;
  isDarkModeOn: boolean;
  setIsDarkModeOn: Dispatch<SetStateAction<boolean>>;
  toggleTheme: () => void;
  theme: Theme;
}
