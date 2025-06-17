import { SnackbarStateType, UserLocationType, UserType } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export type SnackbarSeverityType = 'error' | 'info' | 'warning' | 'success';

export type SnackbarEventType = {
  message: string;
  severity: SnackbarSeverityType;
};
export interface ContextProps {
  snackbarState: SnackbarStateType;
  handleOpenSnackbar: (event: SnackbarEventType) => void;
  handleCloseSnackbar: () => void;
  registeringUser: UserType | null;
  setRegisteringUser: Dispatch<SetStateAction<UserType | null>>;
  userLocation: UserLocationType;
  setUserLocation: Dispatch<SetStateAction<UserLocationType>>;
  normalizedPath: string;
  isLoadingAvatar: boolean;
  refetchAvatar: () => {};
  avatar: string | undefined;
}
