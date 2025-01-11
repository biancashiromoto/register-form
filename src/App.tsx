import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import DatePicker from './components/DatePicker';
import InputPhone from './components/InputPhone';
import InputText from './components/InputText';
import { firstStepSchema } from './schemas/firstStepSchema';
import { useResetForm } from './hooks/useResetForm';

function App() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(firstStepSchema),
    mode: 'all',
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      phone: '',
      countryCode: '',
    },
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const birthDate = watch('birthDate');
  const email = watch('email');
  const phone = watch('phone');

  useResetForm(firstName, resetField, 'lastName');
  useResetForm(lastName, resetField, 'birthDate');
  useResetForm(birthDate, resetField, 'email');
  useResetForm(email, resetField, 'phone');
  useResetForm(email, resetField, 'countryCode');

  const onSubmit = async (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <Box width="100%" maxWidth="400px" mx="auto" mt={4}>
      <h1>Register Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        {!!firstName &&
          !errors.firstName &&
          !!lastName &&
          !errors.lastName &&
          !!email &&
          !errors.email &&
          !!phone &&
          !errors.phone && (
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Next
            </Button>
          )}
      </form>
    </Box>
  );
}

export default App;
