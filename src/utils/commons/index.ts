import { UserType } from '@/types';
import { SignInWithPasswordCredentials } from '@supabase/supabase-js';

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
  avatar: '',
};

export const INITIAL_LOGIN_STATE: SignInWithPasswordCredentials = {
  email: '',
  password: '',
};
