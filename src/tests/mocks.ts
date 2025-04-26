import { UserType } from '@/types';
import { Session } from '@supabase/supabase-js';

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

export const mockCountries = [
  {
    name: 'Australia',
    isoCode: 'AU',
    flag: '🇦🇺',
    phonecode: '61',
    currency: 'AUD',
    latitude: '-27.00000000',
    longitude: '133.00000000',
    timezones: [
      {
        zoneName: 'Antarctica/Macquarie',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'MIST',
        tzName: 'Macquarie Island Station Time',
      },
    ],
  },
  {
    name: 'Brazil',
    isoCode: 'BR',
    flag: '🇧🇷',
    phonecode: '55',
    currency: 'BRL',
    latitude: '-10.00000000',
    longitude: '-55.00000000',
    timezones: [
      {
        zoneName: 'America/Araguaina',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time',
      },
      {
        zoneName: 'America/Bahia',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time',
      },
    ],
  },
];

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

export const mockSession: Session = {
  access_token: 'access_token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: 1745620857,
  refresh_token: 'refresh_token',
  user: {
    id: '1-a',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'johndoe@email.com',
    email_confirmed_at: '2025-03-16T23:15:03.544745Z',
    phone: '',
    confirmed_at: '2025-03-16T23:15:03.544745Z',
    recovery_sent_at: '2025-04-21T19:50:41.022959Z',
    last_sign_in_at: '2025-04-25T21:40:57.374600309Z',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
      address: {
        city: 'São Paulo',
        country: 'Brazil',
        state: 'São Paulo',
      },
      avatar_url: 'avatar_url.jpg',
      birth_date: '1990-09-09',
      email: 'johndoe@email.com',
      email_verified: true,
      first_name: 'John',
      last_name: 'Doe',
      phone_verified: false,
      sub: '1-a',
    },
    identities: [
      {
        identity_id: '1-a',
        id: '1-a',
        user_id: '1-a',
        identity_data: {
          address: {
            city: 'São Paulo',
            country: 'Brazil',
            state: 'São Paulo',
          },
          birth_date: '1990-09-09',
          email: 'johndoe@email.com',
          email_verified: true,
          first_name: 'John',
          last_name: 'Doe',
          phone_verified: false,
          sub: '1-a',
        },
        provider: 'email',
        last_sign_in_at: '2025-03-16T23:14:28.448396Z',
        created_at: '2025-03-16T23:14:28.448442Z',
        updated_at: '2025-03-16T23:14:28.448442Z',
      },
    ],
    created_at: '2025-03-16T23:14:28.440241Z',
    updated_at: '2025-04-25T21:40:57.416982Z',
    is_anonymous: false,
  },
};
