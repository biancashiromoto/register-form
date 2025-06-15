import { SnackbarStateType, UserLocationType, UserType } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackbarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
  registeringUser: UserType | null;
  setRegisteringUser: Dispatch<SetStateAction<UserType | null>>;
  userLocation: UserLocationType;
  setUserLocation: Dispatch<SetStateAction<UserLocationType>>;
  normalizedPath: string;
  isLoadingAvatar: boolean;
  refetchAvatar: () => {};
  avatar: string | undefined;
}
