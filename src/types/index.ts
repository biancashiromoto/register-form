import { AlertColor } from '@mui/material';
import { ICity, ICountry, IState } from 'country-state-city';

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
  address: {
    country: string;
    state: string;
    city: string;
  };
}

export type AddressType = {
  country: ICountry;
  state: IState;
  city: ICity;
};

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
