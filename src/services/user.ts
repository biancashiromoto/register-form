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

export const isAuthenticated = async (): Promise<boolean> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error.message);
    return false;
  }

  return !!data.session;
};

export const updateUser = async (user: UserType) => {
  const { email, firstName, lastName, birthDate } = user;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !user) return;

  const { error, data } = await supabase.auth.admin.updateUserById(
    session.user.id,
    {
      email,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
      },
    },
  );

  if (error) throw new Error(error.message);

  return { ok: true };
};

export const resetPassword = async (password: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !password) return;

  const { error, data } = await supabase.auth.admin.updateUserById(
    session.user.id,
    {
      password,
    },
  );

  if (error) throw new Error(error.message);

  return { data };
};
