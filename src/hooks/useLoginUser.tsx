import { useAuth } from '@/context/authContext';
import { loginUser } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { UseFormSetError } from 'react-hook-form';

interface LoginCredentials {
  email: string;
  password: string;
}

type SetErrorFunction = UseFormSetError<LoginCredentials>;

const useLoginUser = (setError: SetErrorFunction) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const mutation = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await loginUser(credentials);
      if (!response || !response.data?.session) {
        throw new Error('Invalid login credentials');
      }
      setUser(response.data.user);
      return response.data;
    },
    onSuccess: () => {
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
