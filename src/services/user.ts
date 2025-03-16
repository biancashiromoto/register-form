import { supabase } from '@/services/supabase';
import { UserType } from '@/types';

export const signUpUser = async (user: UserType) => {
  const { email, password, firstName, lastName, birthDate, address } = user;

  if (!email || !password) return;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        address: {
          country: address.country,
          state: address.state,
          city: address.city,
        },
      },
    },
  });

  if (error) throw new Error(error.message);

  return { data };
};

export const loginUser = async (userInfo: any) => {
  const { email, password } = userInfo;

  if (!email || !password) return;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return { data };
};

export const updateUser = async (user: any) => {
  const { email, firstName, lastName } = user;
  const { data, error } = await supabase.auth.updateUser({
    email,
    data: {
      first_name: firstName,
      last_name: lastName,
    },
  });

  if (error) throw new Error(error.message);

  return { data };
};
