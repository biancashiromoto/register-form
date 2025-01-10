import { Box, TextField } from '@mui/material';

type DatePickerType = {
  shouldShow?: boolean;
  errors: any;
  register: any;
};

const DatePicker = ({
  shouldShow = true,
  errors,
  register,
}: DatePickerType) => {
  return (
    shouldShow && (
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
    )
  );
};

export default DatePicker;
