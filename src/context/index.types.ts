import { SnackbarStateType, UserLocationType, UserType } from '@/types';
import { Session } from '@supabase/supabase-js';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackbarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
  registeringUser: UserType | null;
  setRegisteringUser: Dispatch<SetStateAction<UserType | null>>;
  userLocation: UserLocationType;
  setUserLocation: Dispatch<SetStateAction<UserLocationType>>;
  normalizedPath: string;
  avatarPath: string | null;
  uploadAvatar: (file: File, session: Session) => void;
  isLoadingAvatar: boolean;
  setAvatarPath: Dispatch<SetStateAction<string | null>>;
  setIsLoadingAvatar: Dispatch<SetStateAction<boolean>>;
}
