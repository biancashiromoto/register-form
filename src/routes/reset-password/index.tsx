import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import useResetPassword from '@/hooks/useResetPassword';
import useValidateResetLink from '@/hooks/useValidateResetLink';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { supabase } from '@/services/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/reset-password/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoadingValidateResetLink, isValidResetLink } =
    useValidateResetLink();
  const {
    mutate: resetPassword,
    isPending: isPendingResetPassword,
    sendResetPasswordEmail,
  } = useResetPassword();
  const { currentSession } = useAuth();
  const { snackbarState } = useContext(Context);
  const navigate = useNavigate();
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const type = hashParams.get('type');
  const accessToken = hashParams.get('access_token');

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        const newPassword = prompt(
          'What would you like your new password to be?',
        );
        if (!newPassword) return;
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (data) alert('Password updated successfully!');
        if (error) alert('There was an error updating your password.');
      }
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    currentPassword?: string | undefined;
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
    defaultValues: {
      currentPassword: undefined,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: {
    currentPassword?: string | undefined;
    password: string;
    confirmPassword: string;
  }) => {
    resetPassword({
      newPassword: data.password,
      currentPassword: data.currentPassword,
    });
  };

  useEffect(() => {
    if (snackbarState.severity === 'success' && !snackbarState.open) {
      navigate({ to: `${currentSession ? '/profile' : '/login'}` });
    }
  }, [snackbarState, currentSession, navigate]);

  if (isLoadingValidateResetLink) return <LoadingLayer />;

  // if (!isValidResetLink) {
  //   return (
  //     <Container maxWidth="sm">
  //       <Typography variant="h5" align="center" gutterBottom>
  //         Invalid Reset Link
  //       </Typography>
  //       <Typography variant="body1" align="center" gutterBottom>
  //         This password reset link is invalid or has expired. Please request a
  //         new password reset.
  //       </Typography>
  //       <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
  //         <CustomButton href="/login" openInNewTab={false}>
  //           Return to Login
  //         </CustomButton>
  //       </Box>
  //     </Container>
  //   );
  // }

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 4,
        }}
      >
        {currentSession && (
          <InputPassword
            errors={errors}
            register={register}
            name="currentPassword"
            label="Current password"
          />
        )}
        <InputPassword errors={errors} register={register} />
        <InputPassword errors={errors} register={register} isConfirmPassword />
        <CustomButton type="submit" disabled={isPendingResetPassword}>
          Update Password
        </CustomButton>
        <CustomButton
          variant="outlined"
          color="primary"
          onClick={() => sendResetPasswordEmail(currentSession?.user?.email)}
          disabled={isPendingResetPassword}
        >
          Forgot your password?
        </CustomButton>
      </Box>
      {snackbarState && <CustomSnackbar />}
    </Container>
  );
}
