import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import useResetPassword from '@/hooks/useResetPassword';
import useValidateResetLink from '@/hooks/useValidateResetLink';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/reset-password/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isLoadingValidateResetLink, isValidResetLink } =
    useValidateResetLink();
  const { mutate: resetPassword, isPending: isPendingResetPassword } =
    useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'all',
  });
  const password = watch('password');

  const onSubmit = async () => {
    resetPassword(password);
  };

  if (isLoadingValidateResetLink || isPendingResetPassword)
    return <LoadingLayer />;

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
          <CustomButton href="/login" openInNewTab={false}>
            Return to Login
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
        <InputPassword errors={errors} register={register} />
        <InputPassword errors={errors} register={register} isConfirmPassword />
        <CustomButton type="submit">Update Password</CustomButton>
      </Box>
      <CustomSnackbar />
    </Container>
  );
}
