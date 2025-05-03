import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import useResetPassword from '@/hooks/useResetPassword';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { supabase } from '@/services/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

function InvalidResetLink() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        Invalid Reset Link
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        This password reset link is invalid or has expired. Please request a new
        password reset.
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CustomButton href="/login">Return to Login</CustomButton>
      </Box>
    </Container>
  );
}

export const Route = createFileRoute('/reset-password/')({
  validateSearch: (search) => {
    const token = search.token as string;
    if (!token) throw new Error('Invalid or expired token');
    return { token };
  },
  loader: async ({ location }) => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (!token) throw new Error('Invalid or expired token');

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery',
    });

    if (error || !data.session)
      throw new Error('Invalid or expired reset link');

    return null;
  },
  errorComponent: () => {
    return <InvalidResetLink />;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: resetPassword, isPending: isPendingResetPassword } =
    useResetPassword();
  const { snackbarState } = useContext(Context);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
    defaultValues: {
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
    });
  };

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
        <InputPassword
          errors={errors}
          register={register}
          label="New password"
        />
        <InputPassword
          errors={errors}
          register={register}
          isConfirmPassword
          label="Confirm new password"
        />
        <CustomButton type="submit" disabled={isPendingResetPassword}>
          Update Password
        </CustomButton>
      </Box>
      {snackbarState && <CustomSnackbar />}
    </Container>
  );
}
