import { SnackbarStateType, UserType } from '@/types';
import { Theme } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackbarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
  isDarkModeOn: boolean;
  setIsDarkModeOn: Dispatch<SetStateAction<boolean>>;
  toggleTheme: () => void;
  theme: Theme;
  isPrivateRoute: boolean;
  normalizedPath: string;
  registeringUser: UserType | null;
  setRegisteringUser: Dispatch<SetStateAction<UserType | null>>;
}
