import { labels } from '@/helpers/labels';
import { UserType } from '@/types';
import { Box, TextField } from '@mui/material';
import { FieldErrors } from 'react-hook-form';

type LabelKeys = keyof typeof labels;

export type InputTextProps = {
  shouldShow: boolean;
  name: LabelKeys;
  register: any;
  errors: FieldErrors<UserType>;
};

const InputText = ({
  shouldShow = true,
  errors,
  register,
  name,
}: InputTextProps) => {
  return (
    shouldShow && (
      <Box mb={2}>
        <TextField
          id={name}
          label={labels[name]}
          fullWidth
          {...register(name)}
          error={!!errors[name]}
          helperText={errors[name]?.message?.toString()}
        />
      </Box>
    )
  );
};

export default InputText;
