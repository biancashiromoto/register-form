import { Context } from '@/context';
import { registerUser } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

const useRegisterUser = () => {
  const { setSnackbarState } = useContext(Context);
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
      navigate({ to: '/' });
    },
    onError: ({ message }) => {
      setSnackbarState({
        open: true,
        message: `Error registering user: ${message}`,
        severity: 'error',
      });
    },
  });

  return { mutate };
};

export default useRegisterUser;
