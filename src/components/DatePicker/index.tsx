import { TextField } from '@mui/material';
import { ComponentProps, memo } from 'react';

export interface DatePickerProps extends ComponentProps<'input'> {
  errors: any;
  register: any;
}

const DatePicker = memo(
  ({
    errors,
    register,
    required = false,
    hidden,
    ...rest
  }: DatePickerProps) => {
    return (
      !hidden && (
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
      )
    );
  },
);

export default DatePicker;
