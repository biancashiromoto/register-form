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

export const loginUser = async (
  userInfo: Pick<UserType, 'email' | 'password'>,
) => {
  const { email, password } = userInfo;

  if (!email || !password) return;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return { data };
};

export const updateUser = async (user: UserType) => {
  const { email, firstName, lastName, birthDate } = user;
  const { data, error } = await supabase.auth.updateUser({
    email,
    data: {
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
    },
  });

  if (error) throw new Error(error.message);

  return { data };
};

export const resetPassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
