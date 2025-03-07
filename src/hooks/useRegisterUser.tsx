import { Context } from '@/context';
import { registerUser } from '@/services/user';
import { UserType } from '@/types';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

const useRegisterUser = () => {
  const { setSnackbarState, setUser } = useContext(Context);

  const { mutate } = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: (data: UserType) => registerUser(data),
    onSuccess: () => {
      setSnackbarState({
        open: true,
        message: 'User successfully registered!',
        severity: 'success',
      });
    },
    onError: (error) => {
      setSnackbarState({
        open: true,
        message: error.message,
        severity: 'error',
      });
    },
    onSettled: () => {
      setUser(INITIAL_USER_STATE);
    },
  });

  return { mutate };
};

export default useRegisterUser;
