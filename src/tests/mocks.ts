import { UserType } from '@/types';

export const mockCountries = [
  {
    code: '+55',
    nameEng: 'Brazil',
    flag: { src: 'br-flag.png', altText: 'Brazil flag' },
    iso: 'BRA',
  },
  {
    code: '+1',
    nameEng: 'Canada',
    flag: { src: 'ca-flag.png', altText: 'Canada flag' },
    iso: 'CAN',
  },
];

export const mockUser: UserType = {
  birthDate: '1990-11-11',
  countryCode: mockCountries[0].code,
  email: 'johndoe@email.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '12345678',
};
