import { Box, TextField } from '@mui/material';

type InputPhoneType = {
  shouldShow: boolean;
  errors: any;
  register: any;
};

const InputPhone = ({ shouldShow, errors, register }: InputPhoneType) => {
  return (
    shouldShow && (
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
    )
  );
};

export default InputPhone;
