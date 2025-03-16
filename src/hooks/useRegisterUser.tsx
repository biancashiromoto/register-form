import { Context } from '@/context';
import { signUpUser } from '@/services/user';
import { UserType } from '@/types';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const useRegisterUser = () => {
  const { setSnackbarState, setRegisteringUser } = useContext(Context);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: (data: UserType) => signUpUser(data),
    onSuccess: async () => {
      setSnackbarState({
        open: true,
        message: 'User successfully registered!',
        severity: 'success',
      });
      await delay(100);
      navigate({ to: '/login', replace: true, viewTransition: true });
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
