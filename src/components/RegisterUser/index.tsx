import { Context } from '@/context';
import { useResetForm } from '@/hooks/useResetForm';
import { firstStepSchema } from '@/schemas/firstStepSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { ICountry, IState } from 'country-state-city';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from '../DatePicker';
import InputPhone from '../InputPhone';
import InputText from '../InputText';
import SelectCity from '../SelectCity';
import SelectCountry from '../SelectCountry';
import SelectState from '../SelectState';

const RegisterUser = () => {
  const { formStepsDispatch } = useContext(Context);
  const [selectedCountry, setSelectedCountry] = useState({} as ICountry);
  const [selectedState, setSelectedState] = useState({} as IState);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(firstStepSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      phone: '',
      countryCode: '',
      country: '',
      state: '',
      city: '',
    },
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const birthDate = watch('birthDate');
  const email = watch('email');
  const phone = watch('phone');
  const country = watch('country');
  const state = watch('state');

  useResetForm(firstName, resetField, 'lastName');
  useResetForm(lastName, resetField, 'birthDate');
  useResetForm(birthDate, resetField, 'email');
  useResetForm(email, resetField, 'phone');
  useResetForm(email, resetField, 'countryCode');
  useResetForm(phone, resetField, 'country');
  useResetForm(country, resetField, 'state');
  useResetForm(state, resetField, 'city');

  const clearForm = () => {
    reset({
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      phone: '',
      countryCode: '',
      country: '',
    });
    clearErrors();
  };

  const onSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    clearForm();
  };

  useEffect(() => {
    if (country && typeof country === 'object') {
      setSelectedCountry(country);
    }
  }, [country]);

  useEffect(() => {
    if (state && typeof state === 'object') {
      setSelectedState(state);
    }
  }, [state]);

  return (
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
      />

      <InputText
        shouldShow={!!firstName && !errors.firstName}
        errors={errors}
        name="lastName"
        register={register}
      />

      <DatePicker
        shouldShow={
          !!firstName && !errors.firstName && !!lastName && !errors.lastName
        }
        errors={errors}
        register={register}
      />

      <InputText
        shouldShow={
          !!firstName &&
          !errors.firstName &&
          !!lastName &&
          !errors.lastName &&
          !!birthDate &&
          !errors.birthDate
        }
        errors={errors}
        name="email"
        register={register}
      />

      <InputPhone
        setValue={setValue}
        shouldShow={
          !!firstName &&
          !errors.firstName &&
          !!lastName &&
          !errors.lastName &&
          !!email &&
          !errors.email
        }
        errors={errors}
        register={register}
      />

      <SelectCountry
        setValue={setValue}
        shouldShow={
          !!firstName &&
          !errors.firstName &&
          !!lastName &&
          !errors.lastName &&
          !!email &&
          !errors.email &&
          !!phone &&
          !errors.phone
        }
        errors={errors}
        register={register}
      />

      <SelectState
        setValue={setValue}
        shouldShow={
          !!firstName &&
          !errors.firstName &&
          !!lastName &&
          !errors.lastName &&
          !!email &&
          !errors.email &&
          !!phone &&
          !errors.phone &&
          !!country &&
          !errors.country
        }
        errors={errors}
        register={register}
        selectedCountry={selectedCountry}
      />

      <SelectCity
        setValue={setValue}
        shouldShow={
          !!firstName &&
          !errors.firstName &&
          !!lastName &&
          !errors.lastName &&
          !!email &&
          !errors.email &&
          !!phone &&
          !errors.phone &&
          !!country &&
          !errors.country
        }
        errors={errors}
        register={register}
        selectedCountry={selectedCountry}
        selectedState={selectedState}
      />

      {!!firstName &&
        !errors.firstName &&
        !!lastName &&
        !errors.lastName &&
        !!email &&
        !errors.email &&
        !!phone &&
        !errors.phone && (
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            style={{ marginTop: '24px' }}
            onClick={() => {
              formStepsDispatch({ type: 'NEXT_STEP' });
            }}
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
    </Box>
  );
};

export default RegisterUser;
