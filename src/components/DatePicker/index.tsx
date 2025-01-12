import { Box, TextField } from '@mui/material';

export type DatePickerProps = {
  shouldShow?: boolean;
  errors: any;
  register: any;
};

const DatePicker = ({
  shouldShow = true,
  errors,
  register,
}: DatePickerProps) => {
  return (
    shouldShow && (
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
        />
      </Box>
    )
  );
};

export default DatePicker;
