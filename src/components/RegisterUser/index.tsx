import { useResetForm } from '@/hooks/useResetForm';
import { firstStepSchema } from '@/schemas/firstStepSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from '../DatePicker';
import InputPassword from '../InputPassword';
import InputText from '../InputText';
import { CustomSnackbar } from '../Snackbar';

const RegisterUser = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
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
      password: '',
      confirmPassword: '',
    },
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const birthDate = watch('birthDate');
  const email = watch('email');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  useResetForm(firstName, resetField, 'lastName');
  useResetForm(lastName, resetField, 'birthDate');
  useResetForm(birthDate, resetField, 'email');
  useResetForm(password, resetField, 'password');
  useResetForm(confirmPassword, resetField, 'confirmPassword');

  const clearForm = () => {
    reset({
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      password: '',
    });
    clearErrors();
  };

  const onSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    clearForm();
    setOpenSnackbar(true);
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
        shouldShow={
          !!firstName && !errors.firstName && !!lastName && !errors.lastName
        }
        errors={errors}
        register={register}
        required
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
        required
        autoComplete="email"
      />

      <InputPassword
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

      <InputPassword
        shouldShow={
          !!firstName &&
          !errors.firstName &&
          !!lastName &&
          !errors.lastName &&
          !!email &&
          !errors.email &&
          !!password &&
          !errors.password
        }
        errors={errors}
        register={register}
        isConfirmPassword
      />

      {!!firstName &&
        !errors.firstName &&
        !!lastName &&
        !errors.lastName &&
        !!email &&
        !errors.email &&
        !!password &&
        !errors.password &&
        !!confirmPassword &&
        !errors.confirmPassword && (
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

      <CustomSnackbar
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
        message="User successfully registered!"
      />
    </Box>
  );
};

export default RegisterUser;
