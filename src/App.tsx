import { Box, Button, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { firstStepSchema } from './schemas/firstStepSchema';

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(firstStepSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <Box width="100%" maxWidth="400px" mx="auto" mt={4}>
      <h1>Payment Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <TextField
            id="first-name"
            label="First Name"
            fullWidth
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message?.toString()}
          />
        </Box>
        <Box mb={2}>
          <TextField
            id="last-name"
            label="Last Name"
            fullWidth
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message?.toString()}
          />
        </Box>
        <Box mb={2}>
          <TextField
            id="birth-date"
            label="Birth Date"
            fullWidth
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('birthDate')}
            error={!!errors.birthDate}
            helperText={errors.birthDate?.message?.toString()}
          />
        </Box>
        <Box mb={2}>
          <TextField
            id="email"
            label="Email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message?.toString()}
          />
        </Box>
        <Box mb={2}>
          <TextField
            id="phone"
            label="Phone"
            fullWidth
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message?.toString()}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Next
        </Button>
      </form>
    </Box>
  );
}

export default App;
