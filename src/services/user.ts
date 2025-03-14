import { supabase } from '@/services/supabase';
import { UserType } from '@/types';

export const registerUser = async (user: UserType) => {
  const { email, password } = user;

  if (!email || !password) return;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
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
