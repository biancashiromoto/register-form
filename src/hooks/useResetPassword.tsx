import { Context } from '@/context';
import { supabase } from '@/services/supabase';
import { resetPassword } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';

const useResetPassword = () => {
  const { setSnackbarState } = useContext(Context);

  const sendResetPasswordEmail = async (
    email: UserType['email'] | undefined,
  ) => {
    if (!email) {
      setSnackbarState({
        open: true,
        message: 'Please enter a valid email',
        severity: 'error',
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);
    const message =
      error?.message ||
      'A password recovery email has been sent to your inbox.';
    const severity = error ? 'error' : 'success';

    setSnackbarState({
      open: true,
      message,
      severity,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: (newPassword: string) => resetPassword(newPassword),
    onSuccess: () => {
      setSnackbarState({
        open: true,
        message: 'Password successfully updated!',
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
      console.log('settled');
    },
  });

  useEffect(() => console.log('isPending', isPending), [isPending]);

  return { mutate, isPending, sendResetPasswordEmail };
};

export default useResetPassword;
