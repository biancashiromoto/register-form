import CustomButton from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import UserLocation from '@/components/UserLocation';
import { Context } from '@/context';
import useRegisterUser from '@/hooks/useRegisterUser';
import { useResetForm } from '@/hooks/useResetForm';
import { registerSchema } from '@/schemas/registerSchema';
import { UserType } from '@/types';
import { INITIAL_REGISTER_STATE } from '@/utils/commons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, Container, FormControlLabel } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { City, Country, State } from 'country-state-city';
import { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.authentication.session) throw redirect({ to: '/home' });
  },
});

export function RouteComponent() {
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
    resolver: zodResolver(registerSchema),
    mode: 'all',
    defaultValues: INITIAL_REGISTER_STATE,
  });

  const { snackbarState } = useContext(Context);
  const { mutate: registerUser, isPending } = useRegisterUser();
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const birthDate = watch('birthDate');
  const email = watch('email');
  const password = watch('password');
  const country = watch('address.country');
  const state = watch('address.state');
  const city = watch('address.city');

  useResetForm(firstName, resetField, 'lastName');
  useResetForm(lastName, resetField, 'birthDate');
  useResetForm(birthDate, resetField, 'email');
  useResetForm(email, resetField, 'password');
  useResetForm(password, resetField, 'confirmPassword');

  const clearForm = () => {
    reset(INITIAL_REGISTER_STATE);
    clearErrors();
    setShowLocation(false);
  };

  const onSubmit = (data: UserType) =>
    registerUser({ ...data, address: getValues('address') });

  const shouldShowPasswordFields = () => {
    if (!email || errors.email) return false;
    if (!showLocation) return true;

    const selectedCountry = Country.getAllCountries().find(
      (c) => c.name === country,
    );
    const states = selectedCountry
      ? State.getStatesOfCountry(selectedCountry.isoCode)
      : [];

    if (states.length === 0) {
      return !!country && !errors?.address?.country;
    }

    const selectedState = states.find((s) => s.name === state);
    const cities =
      selectedState && selectedCountry
        ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
        : [];

    if (cities.length === 0) {
      return !!state && !errors?.address?.state;
    }

    return !!city && !errors?.address?.city;
  };

  const shouldShowSubmitButton = useMemo(() => {
    if (!isValid) return false;
    if (!showLocation) return true;
    return shouldShowPasswordFields();
  }, [isValid, showLocation, country, state, city, errors]);

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

        {shouldShowSubmitButton && (
          <CustomButton variant="contained" color="primary" type="submit">
            Sign up
          </CustomButton>
        )}

        <CustomButton variant="outlined" color="primary" onClick={clearForm}>
          Clear form
        </CustomButton>
      </Box>
      {snackbarState.open && <CustomSnackbar />}
    </Container>
  );
}
