import AlreadySignedIn from '@/components/AlreadySignedIn';
import CustomAutocomplete from '@/components/Autocomplete';
import CustomButton from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import LoadingLayer from '@/components/LoadingLayer';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import useRegisterUser from '@/hooks/useRegisterUser';
import { useResetForm } from '@/hooks/useResetForm';
import { firstStepSchema } from '@/schemas/firstStepSchema';
import { SnackbarStateType, UserType } from '@/types';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Container } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import {
  City,
  Country,
  ICity,
  ICountry,
  IState,
  State,
} from 'country-state-city';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedCountry, setSelectedCountry] = useState({} as ICountry);
  const [selectedState, setSelectedState] = useState({} as IState);
  const [selectedCity, setSelectedCity] = useState({} as ICity);

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
  };

  const onSubmit = async (data: UserType) => {
    setRegisteringUser({ ...data, address: getValues('address') });
    registerUser({ ...data, address: getValues('address') });
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

        <CustomAutocomplete
          errors={errors}
          field="address.country"
          getValues={getValues}
          label="Country"
          options={Country.getAllCountries()}
          previousField="email"
          setValue={setValue}
          setterCallback={setSelectedCountry}
        />

        <CustomAutocomplete
          errors={errors}
          field="address.state"
          getValues={getValues}
          label="State"
          options={State.getStatesOfCountry(selectedCountry.isoCode)}
          previousField="address.country"
          setValue={setValue}
          setterCallback={setSelectedState}
        />

        <CustomAutocomplete
          errors={errors}
          field="address.city"
          getValues={getValues}
          label="City"
          options={City.getCitiesOfState(
            selectedCountry.isoCode,
            selectedState.isoCode,
          )}
          previousField="address.state"
          setValue={setValue}
          setterCallback={setSelectedCity}
        />

        {!!getValues('address.city') && !errors?.address?.city && (
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
