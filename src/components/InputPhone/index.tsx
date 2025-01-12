import { Box, TextField } from '@mui/material';
import { UserType } from '@/types';
import { FieldErrors } from 'react-hook-form';
import { labels } from '@/helpers/labels';
import SelectCountryCode from '../SelectCountryCode';
import { sortedCountries } from '@/helpers';

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
          <SelectCountryCode
            shouldShow={shouldShow}
            setValue={setValue}
            register={register}
            errors={!!errors.countryCode}
            name="countryCode"
            displayedValue="countryCode"
            label="Select country code"
            options={sortedCountries}
          />
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
