import AlreadySignedIn from '@/components/AlreadySignedIn';
import CustomButton from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import UserLocation from '@/components/UserLocation';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import useRegisterUser from '@/hooks/useRegisterUser';
import { useResetForm } from '@/hooks/useResetForm';
import { firstStepSchema } from '@/schemas/firstStepSchema';
import { SnackbarStateType, UserType } from '@/types';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, Container, FormControlLabel } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [showLocation, setShowLocation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    reset,
    clearErrors,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(firstStepSchema),
    mode: 'all',
    defaultValues: INITIAL_USER_STATE,
  });

  const { snackbarState, setSnackbarState, setRegisteringUser } =
    useContext(Context);
  const { mutate: registerUser, isPending } = useRegisterUser();
  const { sessionRef } = useAuth();

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const birthDate = watch('birthDate');
  const email = watch('email');
  const password = watch('password');

  useResetForm(firstName, resetField, 'lastName');
  useResetForm(lastName, resetField, 'birthDate');
  useResetForm(birthDate, resetField, 'email');
  useResetForm(email, resetField, 'password');
  useResetForm(password, resetField, 'confirmPassword');

  const clearForm = () => {
    reset(INITIAL_USER_STATE);
    clearErrors();
    setShowLocation(false);
  };

  const onSubmit = async (data: UserType) => {
    setRegisteringUser({ ...data, address: getValues('address') });
    registerUser({ ...data, address: getValues('address') });
  };

  const shouldShowPasswordFields = () => {
    if (!email || errors.email) return false;
    if (!showLocation) return true;
    return !!(getValues('address.city') && !errors?.address?.city);
  };

  useEffect(() => {
    setSnackbarState((prevState: SnackbarStateType) => ({
      ...prevState,
      open: false,
    }));
  }, []);

  if (sessionRef) return <AlreadySignedIn />;

  if (isPending) return <LoadingLayer />;

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
        <InputText
          hidden={false}
          errors={errors}
          name="firstName"
          register={register}
          required
        />

        <InputText
          hidden={firstName.length <= 2 || !!errors.firstName}
          errors={errors}
          name="lastName"
          register={register}
          required
        />

        <DatePicker
          hidden={lastName.length <= 2 || !!errors.lastName}
          errors={errors}
          register={register}
          required
        />

        <InputText
          hidden={!birthDate || !!errors.birthDate}
          errors={errors}
          name="email"
          register={register}
          required
          autoComplete="username email"
        />

        {!!email && !errors.email && (
          <FormControlLabel
            control={
              <Checkbox
                checked={showLocation}
                onChange={(e) => setShowLocation(e.target.checked)}
              />
            }
            label="Add location information"
          />
        )}

        {showLocation && (
          <UserLocation
            errors={errors}
            getValues={getValues}
            setValue={setValue}
          />
        )}

        {shouldShowPasswordFields() && (
          <Box width={'100%'} display="flex" flexDirection="column" gap={2}>
            <InputPassword errors={errors} register={register} />
            <InputPassword
              errors={errors}
              register={register}
              isConfirmPassword
            />
          </Box>
        )}

        {isValid && (
          <CustomButton variant="contained" color="primary" type="submit">
            Sign up
          </CustomButton>
        )}

        <CustomButton variant="outlined" color="primary" onClick={clearForm}>
          Clear form
        </CustomButton>
      </Box>
      {snackbarState && <CustomSnackbar />}
    </Container>
  );
}
