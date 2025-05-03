import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useAuthState } from '@/hooks/useAuthState';
import useResetPassword from '@/hooks/useResetPassword';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import { supabase } from '@/services/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, Typography } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
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

type SearchParams = {
  token: string;
  email: string;
};

export const Route = createFileRoute('/reset-password/')({
  // validateSearch: (search: Record<string, unknown>): SearchParams => {
  //   return {
  //     token: search.token as string,
  //     email: search.email as string,
  //   };
  // },
  validateSearch: (search) => {
    const token = search.token as string;
    console.log('validateSearch');
    if (!token) {
      console.log('validateSearch !token');
      throw redirect({ to: '/login' });
    }
    return { token };
  },
  loader: async ({ search }: any) => {
    const { token } = search as SearchParams;

    console.log('loader', token);

    if (!token) {
      console.log('loader !token');
      throw new Error('Invalid or expired link');
    }

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'recovery',
    });

    console.log('verifyOtp', data, error);

    if (error || !data.session) {
      console.log('loader error || !data.session', error, data);
      throw new Error('Invalid or expired link');
    }
    return null;
  },
  errorComponent: () => {
    console.log('errorComponent');
    return <InvalidResetLink />;
  },
  // beforeLoad: async ({ search }: { search: Record<string, unknown> }) => {
  //   const token = search.token as string;
  //   const email = search.email as string;
  //   if (!token || !email) {
  //     return {
  //       token: null,
  //     };
  //   }
  //   const { data, error } = await supabase.auth.verifyOtp({
  //     token_hash: token,
  //     type: 'recovery',
  //   });
  //   console.log('verifyOtp', data, error);
  //   if (error) {
  //     return {
  //       token: null,
  //     };
  //   }
  // },
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: resetPassword, isPending: isPendingResetPassword } =
    useResetPassword();
  const { session, getSession } = useAuthState();
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
