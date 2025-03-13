import { useAuth } from '@/context/authContext';
import { labels } from '@/helpers/labels';
import { UserType } from '@/types';
import { Box, TextField } from '@mui/material';
import { ComponentProps } from 'react';
import { FieldErrors } from 'react-hook-form';

type LabelKeys = keyof typeof labels;

export interface InputTextProps extends ComponentProps<'input'> {
  name: LabelKeys;
  register: any;
  errors: FieldErrors<UserType>;
  required?: boolean;
  autoComplete?: string;
}

const InputText = ({
  errors,
  register,
  name,
  required = false,
  autoComplete = '',
  hidden,
  ...rest
}: InputTextProps) => {
  const { user } = useAuth();

  if (hidden) {
    return null;
  }

  return (
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
        defaultValue={user?.user_metadata[name]}
        {...rest}
      />
    </Box>
  );
};

export default InputText;
