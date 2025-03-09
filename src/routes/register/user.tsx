import DatePicker from '@/components/DatePicker';
import Form from '@/components/Form';
import InputPasswordContainer from '@/components/InputPassword/Container';
import InputText from '@/components/InputText';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { useResetForm } from '@/hooks/useResetForm';
import { firstStepSchema } from '@/schemas/firstStepSchema';
import { SnackbarStateType, UserType } from '@/types';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Route as RegisterRoute } from '.';
import useRegisterUser from '@/hooks/useRegisterUser';
import {
  City,
  Country,
  ICity,
  ICountry,
  IState,
  State,
} from 'country-state-city';

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
      <Form>
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

          <Autocomplete
            hidden={!getValues('email') && !errors.email}
            disablePortal
            options={Country.getAllCountries()}
            getOptionLabel={(option: ICountry) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={errors?.address?.country?.message}
                label="Country"
              />
            )}
            onChange={(_event, newValue) => {
              if (!newValue) return;
              setSelectedCountry(newValue);
              setValue('address.country', newValue.name);
            }}
          />

          <Autocomplete
            hidden={!getValues('address.country') && !errors?.address?.country}
            disablePortal
            options={State.getStatesOfCountry(selectedCountry.isoCode)}
            getOptionLabel={(option: IState) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={errors?.address?.country?.message}
                label="State"
              />
            )}
            onChange={(_event, newValue) => {
              if (!newValue) return;
              setSelectedState(newValue);
              setValue('address.state', newValue.name);
            }}
          />

          <Autocomplete
            hidden={!getValues('address.state') && !errors?.address?.state}
            disablePortal
            options={City.getCitiesOfState(
              selectedCountry.isoCode,
              selectedState.isoCode,
            )}
            getOptionLabel={(option: ICity) => option.name}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={errors?.address?.state?.message}
                label="City"
              />
            )}
            onChange={(_event, newValue) => {
              if (!newValue) return;
              setSelectedCity(newValue);
              setValue('address.city', newValue.name);
            }}
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
      </Form>
    </>
  );
}
