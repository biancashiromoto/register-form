import { Context } from '@/context';
import { supabase } from '@/services/supabase';
import { resetPassword } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { useAuthState } from './useAuthState';

const useResetPassword = () => {
  const { handleOpenSnackbar } = useContext(Context);
  const { signOut } = useAuthState();

  const sendResetPasswordEmail = async (
    email: UserType['email'] | undefined,
  ) => {
    if (!email) {
      handleOpenSnackbar({
        message: 'Please enter a valid email',
        severity: 'error',
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    const message =
      error?.message ??
      'A password recovery email has been sent to your inbox.';
    const severity = error ? 'error' : 'success';

    handleOpenSnackbar({
      message,
      severity,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: (password: string) => resetPassword(password),
    onSuccess: () => {
      handleOpenSnackbar({
        message: 'Password successfully updated!',
        severity: 'success',
      });
      setTimeout(() => {
        signOut();
      }, 1000);
    },
    onError: (error) => handleOpenSnackbar({ ...error, severity: 'error' }),
  });

  return { mutate, isPending, sendResetPasswordEmail };
};

export default useResetPassword;
