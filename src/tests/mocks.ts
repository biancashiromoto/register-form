import { UserType } from '@/types';
import { Country, ICountry } from 'country-state-city';

export const mockUser: UserType = {
  birthDate: '1990-11-11',
  email: 'johndoe@email.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'Password123#',
  confirmPassword: 'Password123#',
  address: {
    country: 'BR',
    state: 'SP',
    city: 'São Paulo',
  },
};

export const mockCountries = [Country.getCountryByCode('BR') as ICountry];

export const mockStates = [
  {
    countryCode: 'BR',
    isoCode: 'SP',
    latitude: '-23.55051990',
    longitude: '-46.63330940',
    name: 'São Paulo',
  },
];

export const mockCities = [
  {
    countryCode: 'BR',
    stateCode: 'SP',
    latitude: '-23.54750000',
    longitude: '-46.63611000',
    name: 'São Paulo',
  },
];
