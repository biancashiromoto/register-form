import { useAuth } from '@/context/authContext';
import { loginUser } from '@/services/user';
import { SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { UseFormSetError } from 'react-hook-form';

type SetErrorFunction = UseFormSetError<SignInWithPasswordCredentials>;

const useLoginUser = (setError: SetErrorFunction) => {
  const navigate = useNavigate();
  const { setUser, setCurrentSession, userRef } = useAuth();

  const waitForUserUpdate = (): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (userRef.current !== null) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  };

  const mutation = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async (credentials: SignInWithPasswordCredentials) => {
      const response = await loginUser(credentials);
      if (!response || !response.data?.session) {
        throw new Error('Invalid login credentials');
      }
      setUser(response.data.user);
      setCurrentSession(response.data.session);
    },
    onSuccess: async () => {
      await waitForUserUpdate();
      navigate({ to: '/home' });
    },
    onError: (error: any) => {
      setError('email', {
        type: 'manual',
        message: error.message || 'Incorrect email or password',
      });
      setError('password', {
        type: 'manual',
        message: error.message || 'Incorrect email or password',
      });
    },
  });

  return {
    login: mutation.mutate,
    isError: mutation.isError,
  };
};

export default useLoginUser;
