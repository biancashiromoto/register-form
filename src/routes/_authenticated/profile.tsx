import { AvatarUploader } from '@/components/AvatarUploader';
import CustomButton from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useAuthState } from '@/hooks/useAuthState';
import useResetPassword from '@/hooks/useResetPassword';
import useUpdateUser from '@/hooks/useUpdateUser';
import { profileEditSchema } from '@/schemas/profileEditSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container, TextField } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { snackbarState } = useContext(Context);
  const { sendResetPasswordEmail } = useResetPassword();
  const { session } = useAuthState();

  const rawBirth = session?.user?.user_metadata.birth_date;

  const formattedBirth = rawBirth
    ? new Date(rawBirth).toISOString().slice(0, 10)
    : '';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(profileEditSchema),
    mode: 'all',
  });

  const onSubmit = (data: any) => updateUser(data);

  if (isUpdatingUser || !session?.user) return <LoadingLayer />;

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
          id="first-name"
          label="First name"
          variant="standard"
          defaultValue={session?.user?.user_metadata['first_name']}
          fullWidth
          {...register('firstName')}
          required
          error={!!errors['firstName']}
        />

        <TextField
          id="last-name"
          label="Last name"
          variant="standard"
          defaultValue={session?.user?.user_metadata['last_name']}
          fullWidth
          {...register('lastName')}
          required
          error={!!errors['lastName']}
        />

        <DatePicker
          defaultValue={formattedBirth}
          errors={errors}
          register={register}
          required
        />

        <TextField
          id="email"
          label="Email"
          variant="standard"
          defaultValue={session?.user?.user_metadata.email}
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
          onClick={() => sendResetPasswordEmail(session?.user.email)}
        >
          Reset password
        </CustomButton>
      </Box>
      {snackbarState.open && <CustomSnackbar />}
    </Container>
  );
}
