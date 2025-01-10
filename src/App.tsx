import { Box, Button, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { firstStepSchema } from './schemas/firstStepSchema';
import InputPhone from './components/InputPhone';
import InputText from './components/InputText';
import DatePicker from './components/DatePicker';

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(firstStepSchema),
    mode: 'all',
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const birthDate = watch('birthDate');
  const email = watch('email');
  const phone = watch('phone');

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <Box width="100%" maxWidth="400px" mx="auto" mt={4}>
      <h1>Payment Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText errors={errors} name="firstName" register={register} />

        <InputText
          shouldShow={firstName && !errors.firstName}
          errors={errors}
          name="lastName"
          register={register}
        />

        <DatePicker
          shouldShow={
            firstName && !errors.firstName && lastName && !errors.lastName
          }
          errors={errors}
          register={register}
        />

        <InputText
          shouldShow={
            firstName &&
            !errors.firstName &&
            lastName &&
            !errors.lastName &&
            birthDate &&
            !errors.birthDate
          }
          errors={errors}
          name="email"
          register={register}
        />

        <InputPhone
          shouldShow={
            firstName &&
            !errors.firstName &&
            lastName &&
            !errors.lastName &&
            email &&
            !errors.email
          }
          register={register}
          errors={errors}
        />

        {firstName &&
          !errors.firstName &&
          lastName &&
          !errors.lastName &&
          email &&
          !errors.email &&
          phone &&
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
