import { supabase, SUPABASE_KEY, SUPABASE_URL } from '@/services/supabase';
import { UserType } from '@/types';
import { getToken } from './auth';

export const registerUser = async (user: UserType) => {
  const { error, status, data } = await supabase
    .from('users')
    .insert([
      {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        birth_date: user.birthDate,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { status, data };
};

export const fetchUserById = async (id: UserType['id']) => {
  const token = await getToken();

  if (!token) {
    throw new Error('Unauthenticated.');
  }

  const { data: authUser, error: authError } =
    await supabase.auth.getUser(token);

  if (authError || !authUser) {
    throw new Error('Expired token.');
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
};
