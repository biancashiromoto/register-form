import { supabase } from './supabase';

export const getToken = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Erro ao obter token:', error.message);
    return null;
  }

  return data.session?.access_token;
};

getToken().then((token) => console.log('Token do usuário:', token));
