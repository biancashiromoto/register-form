import { AddressType, UserType } from '@/types';
import { ICity, ICountry, IState } from 'country-state-city';

export const INITIAL_ADDRESS_STATE: UserType['address'] = {
  country: '',
  state: '',
  city: '',
};

export const INITIAL_USER_STATE: UserType = {
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  password: '',
  confirmPassword: '',
  address: INITIAL_ADDRESS_STATE,
};
