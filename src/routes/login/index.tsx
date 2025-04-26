import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useResetForm } from '@/hooks/useResetForm';
import useResetPassword from '@/hooks/useResetPassword';
import { loginSchema } from '@/schemas/loginSchema';
import { supabase } from '@/services/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container } from '@mui/material';
import { SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

export type SignInWithPasswordCredentialsType =
  SignInWithPasswordCredentials & {
    email: string;
  };
export const Route = createFileRoute('/login/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.session) throw redirect({ to: '/home' });
  },
});

export function RouteComponent() {
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm<SignInWithPasswordCredentialsType>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');
  useResetForm(email, resetField, 'password');
  const { snackbarState, setSnackbarState } = useContext(Context);
  const { sendResetPasswordEmail } = useResetPassword();
  const navigate = useNavigate();

  const onSubmit = async (data: SignInWithPasswordCredentialsType) => {
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      setSnackbarState((prev) => ({
        ...prev,
        open: true,
        message: error.message,
        severity: 'error',
      }));
      return;
    }

    navigate({ to: '/home' });
  };

  return (
    <Container maxWidth="sm">
      <Box
        mt={2}
        mx={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <InputText
          errors={errors}
          name="email"
          register={register}
          required
          autoComplete="email"
        />

        <InputPassword
          hidden={!errors || !!errors.email}
          errors={errors}
          register={register}
          isExistingPassword
        />

        <CustomButton variant="contained" color="primary" type="submit">
          Sign in
        </CustomButton>
        <CustomButton
          variant="outlined"
          color="primary"
          onClick={() => sendResetPasswordEmail(email)}
        >
          Forgot your password?
        </CustomButton>
      </Box>
      {snackbarState && <CustomSnackbar />}
    </Container>
  );
}
