import { AlertColor } from '@mui/material';

export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  password?: string;
  confirmPassword?: string;
  avatar?: string;
  id?: string;
  token?: string;
}

export type FormStepsType = {
  activeStep: number;
};

export type ActionType = {
  type: string;
  payload?: any;
};

export type SnackbarStateType = {
  open: boolean;
  message: string;
  severity: AlertColor | undefined;
};
