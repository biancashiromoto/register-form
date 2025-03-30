import { Context } from '@/context';
import { delay } from '@/helpers';
import { resetPassword } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

const useResetPassword = () => {
  const { setSnackbarState } = useContext(Context);
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: (data: any) => resetPassword(data),
    onSuccess: async () => {
      await delay();
      setSnackbarState({
        open: true,
        message: 'Password successfully updated!',
        severity: 'success',
      });
      navigate({ to: '/login' });
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

export default useResetPassword;
