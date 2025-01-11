import { Box, TextField } from '@mui/material';
import CountrySelect from '../CountrySelect';
import { UserType } from '@/types';
import { FieldErrors } from 'react-hook-form';
import { labels } from '@/helpers/labels';

export type InputPhoneProps = {
  shouldShow?: boolean;
  errors: FieldErrors<UserType>;
  register: any;
  setValue: any;
};

const InputPhone = ({
  shouldShow = true,
  errors,
  register,
  setValue,
}: InputPhoneProps) => {
  return (
    shouldShow && (
      <Box display="flex" gap={2} justifyContent="center">
        <Box flex="3">
          <CountrySelect setValue={setValue} errors={errors.countryCode} />
        </Box>
        <Box flex="3" mb={2}>
          <TextField
            id="phone"
            label={labels.phone}
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
