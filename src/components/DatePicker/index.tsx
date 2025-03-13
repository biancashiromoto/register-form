import { Box, TextField } from '@mui/material';
import { ComponentProps } from 'react';

export interface DatePickerProps extends ComponentProps<'input'> {
  errors: any;
  register: any;
}

const DatePicker = ({
  errors,
  register,
  required = false,
  hidden,
  ...rest
}: DatePickerProps) => {
  return (
    !hidden && (
      <Box mb={2}>
        <TextField
          id="birth-date"
          label="Birth date"
          fullWidth
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          {...register('birthDate')}
          error={!!errors.birthDate}
          helperText={errors.birthDate?.message?.toString()}
          required={required}
          {...rest}
        />
      </Box>
    )
  );
};

export default DatePicker;
