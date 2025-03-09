import DatePicker from '@/components/DatePicker';
import InputPasswordContainer from '@/components/InputPassword/Container';
import InputText from '@/components/InputText';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import useRegisterUser from '@/hooks/useRegisterUser';
import { useResetForm } from '@/hooks/useResetForm';
import { firstStepSchema } from '@/schemas/firstStepSchema';
import { SnackbarStateType, UserType } from '@/types';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { createRoute } from '@tanstack/react-router';
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
import { Route as RegisterRoute } from '.';
import CustomAutocomplete from '@/components/Autocomplete';

export const Route = createRoute({
  getParentRoute: () => RegisterRoute,
  path: 'user',
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

  const { snackbarState, setSnackbarState } = useContext(Context);
  const { mutate: registerUser } = useRegisterUser();

  useEffect(
    () =>
      setSnackbarState((prevState: SnackbarStateType) => ({
        ...prevState,
        open: false,
      })),
    [],
  );

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
    registerUser(data);
  };

  return (
    <>
      <h2>Register</h2>
      <Box
        width="100%"
        maxWidth="400px"
        mx="auto"
        mt={4}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputText
          shouldShow
          errors={errors}
          name="firstName"
          register={register}
          required
        />

        <InputText
          shouldShow={!!firstName && !errors.firstName}
          errors={errors}
          name="lastName"
          register={register}
          required
        />

        <DatePicker
          shouldShow={!!lastName && !errors.lastName}
          errors={errors}
          register={register}
          required
        />

        <InputText
          shouldShow={!!birthDate && !errors.birthDate}
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

        <InputPasswordContainer
          shouldShow={!!getValues('address.city') && !errors?.address?.city}
          errors={errors}
          register={register}
        />

        {isValid && (
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

        <Button
          variant="outlined"
          color="primary"
          type="button"
          fullWidth
          style={{ marginTop: '24px' }}
          onClick={clearForm}
        >
          Clear form
        </Button>

        {snackbarState && <CustomSnackbar />}
      </Box>
    </>
  );
}
