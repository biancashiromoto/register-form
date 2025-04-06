import { Context } from '@/context';
import { signUpUser } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

const useRegisterUser = () => {
  const { setSnackbarState } = useContext(Context);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: (data: UserType) => signUpUser(data),
    onSuccess: async () => {
      navigate({
        to: '/register/success',
        replace: true,
        viewTransition: true,
      });
    },
    onError: (error) => {
      setSnackbarState({
        open: true,
        message: error.message,
        severity: 'error',
      });
    },
  });

  return { mutate, isPending };
};

export default useRegisterUser;
