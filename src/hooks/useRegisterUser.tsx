import { Context } from '@/context';
import { scrollToTop } from '@/helpers';
import { signUpUser } from '@/services/user';
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
    mutationFn: (data: UserType) => signUpUser(data),
    onSuccess: () => {
      scrollToTop();
      setSnackbarState({
        open: true,
        message: 'User successfully registered!',
        severity: 'success',
      });
      setTimeout(() => {
        navigate({ to: '/login', replace: true });
      }, 100);
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
