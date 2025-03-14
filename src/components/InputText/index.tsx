import { useAuth } from '@/context/authContext';
import { labels } from '@/helpers/labels';
import { UserType } from '@/types';
import { TextField, useTheme } from '@mui/material';
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
  const theme = useTheme();

  if (hidden) {
    return null;
  }

  return (
    <TextField
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
      id={name}
      label={labels[name]}
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name]?.message?.toString()}
      required={required}
      autoComplete={autoComplete}
      defaultValue={user?.user_metadata[name]}
      fullWidth
      {...rest}
    />
  );
};

export default InputText;
