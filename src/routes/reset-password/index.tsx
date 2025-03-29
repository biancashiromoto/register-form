import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { supabase } from '@/services/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/reset-password/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const { setSnackbarState } = useContext(Context);
  const navigate = useNavigate();
  const { user } = useAuth();

  const onSubmit = async (data: any) => {
    await supabase.auth.updateUser({
      password: data.new_password,
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'all',
  });

  if (isLoading) return <LoadingLayer />;

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        Reset Password
      </Typography>
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
