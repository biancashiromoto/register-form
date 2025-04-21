import { loginUser } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { UseFormSetError } from 'react-hook-form';

type SetErrorFunction = UseFormSetError<{ email: string; password: string }>;

const useLoginUser = (setError: SetErrorFunction) => {
  const navigate = useNavigate();

  const { isError, mutate, isPending } = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async (credentials: Pick<UserType, 'email' | 'password'>) =>
      await loginUser(credentials),
    onSuccess: async () => {
      navigate({ to: '/home', viewTransition: true });
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
    mutate,
    isError,
    isPending,
  };
};

export default useLoginUser;
