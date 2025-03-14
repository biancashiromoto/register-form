import CustomButton from '@/components/Button';
import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import useLoginUser from '@/hooks/useLoginUser';
import { useResetForm } from '@/hooks/useResetForm';
import { loginSchema } from '@/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';
import { SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { createFileRoute } from '@tanstack/react-router';
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
  const { login } = useLoginUser(setError);

  const onSubmit = (data: SignInWithPasswordCredentials) => {
    login(data);
  };

  return (
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
        hidden={!!errors.email}
        errors={errors}
        register={register}
        isExistingPassword
      />

      {!!email && !errors.email && !!password && !errors.password && (
        <CustomButton variant="contained" color="primary" type="submit">
          Next
        </CustomButton>
      )}
    </Box>
  );
}
