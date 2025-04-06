import { Context } from '@/context';
import { supabase } from '@/services/supabase';
import { resetPassword } from '@/services/user';
import { UserType } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

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

    const redirectUrl = `${window.location.origin}/reset-password`;
    console.log(redirectUrl);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setSnackbarState({
      open: true,
      message: error
        ? error.message
        : 'A password recovery email has been sent successfully. Please check your inbox for instructions.',
      severity: error ? 'error' : 'success',
    });

    console.log('signing out...');

    await supabase.auth.signOut();
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
