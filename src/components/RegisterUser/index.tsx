import { Context } from '@/context';
import { useResetForm } from '@/hooks/useResetForm';
import { firstStepSchema } from '@/schemas/firstStepSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from '../DatePicker';
import InputPhone from '../InputPhone';
import InputText from '../InputText';
import SelectCountry from '../SelectCountry';

const RegisterUser = () => {
  const { formStepsDispatch } = useContext(Context);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
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
    },
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const birthDate = watch('birthDate');
  const email = watch('email');
  const phone = watch('phone');
  const country = watch('country');

  useResetForm(firstName, resetField, 'lastName');
  useResetForm(lastName, resetField, 'birthDate');
  useResetForm(birthDate, resetField, 'email');
  useResetForm(email, resetField, 'phone');
  useResetForm(email, resetField, 'countryCode');
  useResetForm(phone, resetField, 'country');

  const onSubmit = async (data: any) => {
    console.log('Form submitted:', data);
  };

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
    </Box>
  );
};

export default RegisterUser;
