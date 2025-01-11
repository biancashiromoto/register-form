import { Box, TextField } from '@mui/material';
import CountrySelect from '../CountrySelect';

type InputPhoneType = {
  shouldShow?: boolean;
  errors: any;
  register: any;
  setValue: any;
};

const InputPhone = ({
  shouldShow = true,
  errors,
  register,
  setValue,
}: InputPhoneType) => {
  return (
    shouldShow && (
      <Box display="flex" gap={2} justifyContent="center">
        <Box flex="2">
          <CountrySelect setValue={setValue} />
        </Box>
        <Box flex="3" mb={2}>
          <TextField
            id="phone"
            label="Phone"
            fullWidth
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message?.toString()}
          />
        </Box>
      </Box>
    )
  );
};

export default InputPhone;
