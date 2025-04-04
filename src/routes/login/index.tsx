import AlreadySignedIn from '@/components/AlreadySignedIn';
import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import useLoginUser from '@/hooks/useLoginUser';
import { useResetForm } from '@/hooks/useResetForm';
import { loginSchema } from '@/schemas/loginSchema';
import { supabase } from '@/services/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container } from '@mui/material';
import { SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');
  const password = watch('password');
  useResetForm(email, resetField, 'password');
  const { mutate: login, isPending } = useLoginUser(setError);
  const { currentSession } = useAuth();
  const navigate = useNavigate();
  const { snackbarState, setSnackbarState } = useContext(Context);

  const sendResetPasswordEmail = async () => {
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
    navigate({ to: '/login' });
  };

  const onSubmit = (data: SignInWithPasswordCredentials) => {
    login(data);
  };

  if (currentSession) return <AlreadySignedIn />;

  if (isPending) return <LoadingLayer />;

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
          Log in
        </CustomButton>
        <CustomButton
          variant="outlined"
          color="primary"
          onClick={sendResetPasswordEmail}
        >
          Forgot your password?
        </CustomButton>
      </Box>
      {snackbarState && <CustomSnackbar />}
    </Container>
  );
}
