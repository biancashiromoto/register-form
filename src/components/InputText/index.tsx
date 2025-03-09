import { useAuth } from '@/context/authContext';
import { labels } from '@/helpers/labels';
import { UserType } from '@/types';
import { Box, TextField } from '@mui/material';
import { FieldErrors } from 'react-hook-form';

type LabelKeys = keyof typeof labels;

export type InputTextProps = {
  shouldShow?: boolean;
  name: LabelKeys;
  register: any;
  errors: FieldErrors<UserType>;
  required?: boolean;
  autoComplete?: string;
};

const InputText = ({
  shouldShow = true,
  errors,
  register,
  name,
  required = false,
  autoComplete = '',
  ...rest
}: InputTextProps) => {
  const { user } = useAuth();

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
          required={required}
          autoComplete={autoComplete}
          {...rest}
          defaultValue={user?.user_metadata[name]}
        />
      </Box>
    )
  );
};

export default InputText;
