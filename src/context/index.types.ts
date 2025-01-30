import { SnackbarStateType } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackbarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
}
