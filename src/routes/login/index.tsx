import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import useLoginUser from '@/hooks/useLoginUser';
import { useResetForm } from '@/hooks/useResetForm';
import { loginSchema } from '@/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
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

  const onSubmit = (data: { email: string; password: string }) => {
    login(data);
  };

  return (
    <div>
      <h2>Login</h2>
      <Box
        width="100%"
        maxWidth="400px"
        mx="auto"
        mt={4}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputText
          errors={errors}
          name="email"
          register={register}
          required
          autoComplete="email"
        />

        <InputPassword
          shouldShow={!!email}
          errors={errors}
          register={register}
        />

        {!!email && !errors.email && !!password && !errors.password && (
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            style={{ marginTop: '24px' }}
          >
            Next
          </Button>
        )}
      </Box>
    </div>
  );
}
