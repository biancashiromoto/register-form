import { Context } from '@/context';
import { delay } from '@/helpers';
import { supabase } from '@/services/supabase';
import { resetPassword } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

const useResetPassword = () => {
  const { setSnackbarState, isPrivateRoute } = useContext(Context);
  const navigate = useNavigate();

  const sendResetPasswordEmail = async (
    email: UserType['email'] | undefined,
  ) => {
    if (!email) return;

    const redirectUrl = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    setSnackbarState({
      open: true,
      message: error
        ? error.message
        : 'A password recovery email has been sent successfully. Please check your inbox for instructions.',
      severity: error ? 'error' : 'success',
    });
    !isPrivateRoute && navigate({ to: '/login' });
  };

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

  return { mutate, isPending, sendResetPasswordEmail };
};

export default useResetPassword;
