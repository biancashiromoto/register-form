import { Context } from '@/context';
import { registerUser } from '@/services/user';
import { UserType } from '@/types';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

const useRegisterUser = () => {
  const { setSnackbarState, setRegisteringUser } = useContext(Context);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: async (data: UserType) => {
      const response = await registerUser(data);
      if (!response || !response.data?.session) {
        throw new Error('Error registering user');
      }
    },
    onSuccess: () => {
      setSnackbarState({
        open: true,
        message: 'User successfully registered!',
        severity: 'success',
      });
      setTimeout(() => {
        navigate({ to: '/login', replace: true });
      }, 500);
    },
    onError: (error) => {
      setSnackbarState({
        open: true,
        message: error.message,
        severity: 'error',
      });
    },
    onSettled: () => {
      setRegisteringUser(INITIAL_USER_STATE);
    },
  });

  return { mutate, isPending };
};

export default useRegisterUser;
