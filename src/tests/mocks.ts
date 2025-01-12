import { countries } from '@/helpers';
import { UserType } from '@/types';

export const mockUser: UserType = {
  birthDate: '1990-11-11',
  countryCode: countries[0].phonecode,
  email: 'johndoe@email.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '12345678',
  country: countries[0].name,
};
