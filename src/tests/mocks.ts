import { countries } from '@/helpers';
import { UserType } from '@/types';
import { City, State } from 'country-state-city';

export const mockStates = State.getStatesOfCountry(countries[0].isoCode);
export const mockCities = City.getCitiesOfState(
  countries[0].isoCode,
  mockStates[0].isoCode,
);

export const mockUser: UserType = {
  birthDate: '1990-11-11',
  email: 'johndoe@email.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'Password123#',
  confirmPassword: 'Password123#',
};
