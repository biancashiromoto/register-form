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

  const { mutate } = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: (data: UserType) => registerUser(data),
    onSuccess: () => {
      setSnackbarState({
        open: true,
        message: 'User successfully registered!',
        severity: 'success',
      });
      setTimeout(() => {
        navigate({ to: '/login', replace: true });
      }, 2000);
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

  return { mutate };
};

export default useRegisterUser;
