import { UserLocationType, SnackbarStateType, UserType } from '@/types';
import { Theme } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackbarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
  registeringUser: UserType | null;
  setRegisteringUser: Dispatch<SetStateAction<UserType | null>>;
  userLocation: UserLocationType;
  setUserLocation: Dispatch<SetStateAction<UserLocationType>>;
  isDarkModeOn: boolean;
  setIsDarkModeOn: Dispatch<SetStateAction<boolean>>;
  toggleTheme: () => void;
  theme: Theme;
  normalizedPath: string;
  avatarPath: string | null;
  uploadAvatar: (file: File) => void;
  isPendingAvatar: boolean;
  isLoadingAvatar: boolean;
}
