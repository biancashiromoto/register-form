import Form from '@/components/Form';
import SelectCity from '@/components/SelectCity';
import SelectCountry from '@/components/SelectCountry';
import SelectState from '@/components/SelectState';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import useRegisterUser from '@/hooks/useRegisterUser';
import { useResetForm } from '@/hooks/useResetForm';
import { secondStepSchema } from '@/schemas/secondStepSchema';
import { SnackbarStateType, UserType } from '@/types';
import { INITIAL_ADDRESS_STATE } from '@/utils/commons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { ICountry, IState } from 'country-state-city';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Route as RegisterRoute } from '.';

export const Route = createRoute({
  getParentRoute: () => RegisterRoute,
  path: 'address',
  component: RouteComponent,
});

function RouteComponent() {
  const {
    handleSubmit,
    watch,
    resetField,
    reset,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(secondStepSchema),
    mode: 'onBlur',
    defaultValues: INITIAL_ADDRESS_STATE,
  });
  const { snackbarState, setSnackbarState, setUser, user } =
    useContext(Context);
  const navigate = useNavigate();

  const country = watch('country');
  const state = watch('state');

  useResetForm(country, resetField, ['state', 'city']);
  useResetForm(state, resetField, 'city');

  const city = watch('city');

  const [selectedCountry, setSelectedCountry] = useState({} as ICountry);
  const [selectedState, setSelectedState] = useState({} as IState);

  useEffect(() => {
    country && typeof country === 'object' && setSelectedCountry(country);
  }, [country]);

  useEffect(() => {
    state && typeof state === 'object' && setSelectedState(state);
  }, [state]);

  useEffect(
    () =>
      setSnackbarState((prevState: SnackbarStateType) => ({
        ...prevState,
        open: false,
      })),
    [],
  );

  const clearForm = () => {
    reset(INITIAL_ADDRESS_STATE);
    clearErrors();
  };

  const { mutate: registerUser } = useRegisterUser();

  const onSubmit = async (data: UserType['address']) => {
    if (!user) return;
    const updatedUser: UserType = { ...user, address: data };
    setUser(updatedUser);

    registerUser(updatedUser);

    setTimeout(() => {
      navigate({ to: '/register' });
    }, 1500);
  };

  return user ? (
    <Form step={2}>
      <Box
        width="100%"
        maxWidth="400px"
        mx="auto"
        mt={4}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <SelectCountry shouldShow setValue={setValue} errors={errors} />

        <SelectState
          selectedCountry={selectedCountry}
          shouldShow={!!country && !errors.country}
          setValue={setValue}
          errors={errors}
        />

        <SelectCity
          selectedCountry={selectedCountry.isoCode}
          selectedState={selectedState.isoCode}
          shouldShow={!!country && !errors.country && !!state && !errors.state}
          setValue={setValue}
          errors={errors}
        />

        {!!country &&
          !errors.country &&
          !!state &&
          !errors.state &&
          !!city &&
          !errors.city && (
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
  ) : (
    <h2>Not found! =/</h2>
  );
}
