import { Context } from '@/context';
import { signUpUser } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

const useRegisterUser = () => {
  const { handleOpenSnackbar } = useContext(Context);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ['registerUser'],
    mutationFn: (data: UserType) => signUpUser(data),
    onSuccess: () => {
      navigate({
        to: '/register/success',
        replace: true,
        viewTransition: true,
      });
    },
    onError: (error) => handleOpenSnackbar({ ...error, severity: 'error' }),
  });

  return { mutate, isPending };
};

export default useRegisterUser;
