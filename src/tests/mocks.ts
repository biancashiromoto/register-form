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
      {
        zoneName: 'Australia/Adelaide',
        gmtOffset: 37800,
        gmtOffsetName: 'UTC+10:30',
        abbreviation: 'ACDT',
        tzName: 'Australian Central Daylight Saving Time',
      },
      {
        zoneName: 'Australia/Brisbane',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'AEST',
        tzName: 'Australian Eastern Standard Time',
      },
      {
        zoneName: 'Australia/Broken_Hill',
        gmtOffset: 37800,
        gmtOffsetName: 'UTC+10:30',
        abbreviation: 'ACDT',
        tzName: 'Australian Central Daylight Saving Time',
      },
      {
        zoneName: 'Australia/Currie',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AEDT',
        tzName: 'Australian Eastern Daylight Saving Time',
      },
      {
        zoneName: 'Australia/Darwin',
        gmtOffset: 34200,
        gmtOffsetName: 'UTC+09:30',
        abbreviation: 'ACST',
        tzName: 'Australian Central Standard Time',
      },
      {
        zoneName: 'Australia/Eucla',
        gmtOffset: 31500,
        gmtOffsetName: 'UTC+08:45',
        abbreviation: 'ACWST',
        tzName: 'Australian Central Western Standard Time (Unofficial)',
      },
      {
        zoneName: 'Australia/Hobart',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AEDT',
        tzName: 'Australian Eastern Daylight Saving Time',
      },
      {
        zoneName: 'Australia/Lindeman',
        gmtOffset: 36000,
        gmtOffsetName: 'UTC+10:00',
        abbreviation: 'AEST',
        tzName: 'Australian Eastern Standard Time',
      },
      {
        zoneName: 'Australia/Lord_Howe',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'LHST',
        tzName: 'Lord Howe Summer Time',
      },
      {
        zoneName: 'Australia/Melbourne',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AEDT',
        tzName: 'Australian Eastern Daylight Saving Time',
      },
      {
        zoneName: 'Australia/Perth',
        gmtOffset: 28800,
        gmtOffsetName: 'UTC+08:00',
        abbreviation: 'AWST',
        tzName: 'Australian Western Standard Time',
      },
      {
        zoneName: 'Australia/Sydney',
        gmtOffset: 39600,
        gmtOffsetName: 'UTC+11:00',
        abbreviation: 'AEDT',
        tzName: 'Australian Eastern Daylight Saving Time',
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
      {
        zoneName: 'America/Belem',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time',
      },
      {
        zoneName: 'America/Boa_Vista',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AMT',
        tzName: 'Amazon Time (Brazil)[3',
      },
      {
        zoneName: 'America/Campo_Grande',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AMT',
        tzName: 'Amazon Time (Brazil)[3',
      },
      {
        zoneName: 'America/Cuiaba',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'BRT',
        tzName: 'Brasilia Time',
      },
      {
        zoneName: 'America/Eirunepe',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'ACT',
        tzName: 'Acre Time',
      },
      {
        zoneName: 'America/Fortaleza',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time',
      },
      {
        zoneName: 'America/Maceio',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time',
      },
      {
        zoneName: 'America/Manaus',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AMT',
        tzName: 'Amazon Time (Brazil)',
      },
      {
        zoneName: 'America/Noronha',
        gmtOffset: -7200,
        gmtOffsetName: 'UTC-02:00',
        abbreviation: 'FNT',
        tzName: 'Fernando de Noronha Time',
      },
      {
        zoneName: 'America/Porto_Velho',
        gmtOffset: -14400,
        gmtOffsetName: 'UTC-04:00',
        abbreviation: 'AMT',
        tzName: 'Amazon Time (Brazil)[3',
      },
      {
        zoneName: 'America/Recife',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time',
      },
      {
        zoneName: 'America/Rio_Branco',
        gmtOffset: -18000,
        gmtOffsetName: 'UTC-05:00',
        abbreviation: 'ACT',
        tzName: 'Acre Time',
      },
      {
        zoneName: 'America/Santarem',
        gmtOffset: -10800,
        gmtOffsetName: 'UTC-03:00',
        abbreviation: 'BRT',
        tzName: 'Brasília Time',
      },
      {
        zoneName: 'America/Sao_Paulo',
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

export const mockSession = {
  access_token: 'access_token',
  user: mockUser,
} as unknown as Session;
