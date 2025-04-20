import { AvatarUploader } from '@/components/AvatarUploader';
import CustomButton from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import useResetPassword from '@/hooks/useResetPassword';
import useUpdateUser from '@/hooks/useUpdateUser';
import { profileEditSchema } from '@/schemas/profileEditSchema';
import { isAuthenticated } from '@/services/user';
import { SnackbarStateType } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, TextField } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const auth = await isAuthenticated();

    if (!auth) {
      throw redirect({ to: '/unauthenticated' });
    }
  },
});

function RouteComponent() {
  const { sessionRef } = useAuth();
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { snackbarState, setSnackbarState } = useContext(Context);
  const { sendResetPasswordEmail } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(profileEditSchema),
    mode: 'all',
  });

  const onSubmit = async (data: any) => {
    updateUser(data);
  };

  useEffect(() => {
    setSnackbarState((prevState: SnackbarStateType) => ({
      ...prevState,
      open: false,
    }));
  }, []);

  if (isUpdatingUser) return <LoadingLayer />;

  return (
    <Container maxWidth="sm">
      <Box
        mt={2}
        mb={8}
        mx={2}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <AvatarUploader />

        <TextField
          id="standard-basic"
          label="First name"
          variant="standard"
          defaultValue={sessionRef?.user?.user_metadata['first_name']}
          fullWidth
          {...register('firstName')}
          required
          error={!!errors['firstName']}
        />

        <TextField
          id="standard-basic"
          label="Last name"
          variant="standard"
          defaultValue={sessionRef?.user?.user_metadata['last_name']}
          fullWidth
          {...register('lastName')}
          required
          error={!!errors['lastName']}
        />

        <DatePicker
          defaultValue={
            new Date(sessionRef?.user?.user_metadata['birth_date'])
              .toISOString()
              .split('T')[0]
          }
          errors={errors}
          register={register}
          required
        />

        <TextField
          id="standard-basic"
          label="Email"
          variant="standard"
          defaultValue={sessionRef?.user?.user_metadata.email}
          fullWidth
          {...register('email')}
          required
          error={!!errors['email']}
          disabled
        />

        <CustomButton disabled={!isValid} type="submit">
          Save
        </CustomButton>
        <CustomButton
          variant="outlined"
          color="primary"
          onClick={() => sendResetPasswordEmail(sessionRef?.user.email)}
        >
          Reset password
        </CustomButton>
      </Box>
      {snackbarState && <CustomSnackbar />}
    </Container>
  );
}
