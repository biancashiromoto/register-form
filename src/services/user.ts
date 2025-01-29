import { supabase } from '@/services/supabase';
import { UserType } from '@/types';

export const registerUser = async (user: UserType) => {
  const { data, error } = await supabase
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
    console.error('Error creating user:', error.message);
    return null;
  }

  return data;
};

export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    console.error('Error fetching users: ', error.message);
    throw new Error(error.message);
  }

  return data;
};
