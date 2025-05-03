import { Context } from '@/context';
import { delay } from '@/helpers';
import { supabase } from '@/services/supabase';
import { resetPassword } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { useAuthState } from './useAuthState';

const useResetPassword = () => {
  const { setSnackbarState } = useContext(Context);
  const navigate = useNavigate();
  const { session } = useAuthState();

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
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      await resetPassword(newPassword);
    },
    onSuccess: async () => {
      setSnackbarState({
        open: true,
        message: 'Password successfully updated!',
        severity: 'success',
      });
      delay();
      await supabase.auth.signOut();
      localStorage.clear();
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

  return { mutate, isPending, sendResetPasswordEmail };
};

export default useResetPassword;
