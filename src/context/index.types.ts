import { SnackbarStateType } from '@/types';
import { Dispatch, SetStateAction } from 'react';

export interface ContextProps {
  snackBarState: SnackbarStateType;
  setSnackbarState: Dispatch<SetStateAction<SnackbarStateType>>;
}
