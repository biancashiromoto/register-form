import { supabase } from '@/services/supabase';
import { UserType } from '@/types';

export const registerUser = async (user: UserType) => {
  const { error, status, data } = await supabase
    .from('users')
    .insert([
      {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: user.password,
        birth_date: user.birthDate,
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return { status, error, data };
};

export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
