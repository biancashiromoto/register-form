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
import { createFileRoute } from '@tanstack/react-router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type SearchParams = {
  token: string;
};

export const Route = createFileRoute('/reset-password/')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      token: search.token as string,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: resetPassword, isPending: isPendingResetPassword } =
    useResetPassword();
  const { session, getSession } = useAuthState();
  const { snackbarState } = useContext(Context);
  const [isValidResetLink, setIsValidResetLink] = useState<boolean | null>(
    null,
  );

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setIsValidResetLink(false);
      return;
    }

    console.log('session', session);
    console.log('getSession', getSession());

    supabase.auth
      .verifyOtp({ email: session?.user.email ?? '', token, type: 'recovery' })
      .then(({ data, error }) => {
        console.log('verifyOtp', data, error);
        if (error || !data.session) {
          setIsValidResetLink(false);
        } else {
          setIsValidResetLink(true);
        }
      });
  }, []);

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
            href={!session ? '/login' : '/home'}
            openInNewTab={false}
          >
            {!session ? 'Return to Login' : 'Return to Home'}
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
