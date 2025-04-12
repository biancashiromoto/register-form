import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import useResetPassword from '@/hooks/useResetPassword';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/reset-password/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: resetPassword, isPending: isPendingResetPassword } =
    useResetPassword();
  const { sessionRef, isValidResetLink, isLoadingValidateResetLink } =
    useAuth();
  const { snackbarState } = useContext(Context);
  const navigate = useNavigate();

  if (isLoadingValidateResetLink) return <LoadingLayer />;

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

  if (isLoadingValidateResetLink) return <LoadingLayer />;

  if (!isValidResetLink) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" gutterBottom>
          Invalid Reset Link
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          This password reset link is invalid or has expired. Please request a
          new password reset.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CustomButton
            href={!sessionRef ? '/login' : '/home'}
            openInNewTab={false}
          >
            {!sessionRef ? 'Return to Login' : 'Return to Home'}
          </CustomButton>
        </Box>
      </Container>
    );
  }

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
