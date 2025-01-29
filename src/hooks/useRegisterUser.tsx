import { Context } from '@/context';
import { registerUser } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

const useRegisterUser = (onSuccess?: () => void) => {
  const { setSnackbarState } = useContext(Context);

  const mutation = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: (data: UserType) => registerUser(data),
    onSuccess: () => {
      setSnackbarState({
        open: true,
        message: 'User successfully registered!',
        severity: 'success',
      });
      if (onSuccess) onSuccess();
    },
    onError: ({ message }) => {
      setSnackbarState({
        open: true,
        message: `Error registering user: ${message}`,
        severity: 'error',
      });
    },
  });

  return mutation;
};

export default useRegisterUser;
