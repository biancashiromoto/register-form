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
  countryCode: countries[0].phonecode,
  email: 'johndoe@email.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '12345678',
  country: countries[0].name,
  state: mockStates[0].name,
  city: mockCities[0].name,
};
