import { useAuth } from '@/context/authContext';
import { labels } from '@/helpers/labels';
import { UserType } from '@/types';
import { TextField, useTheme } from '@mui/material';
import { ComponentProps, memo, useMemo } from 'react';
import { FieldErrors } from 'react-hook-form';

type LabelKeys = keyof typeof labels;

export interface InputTextProps extends ComponentProps<'input'> {
  name: LabelKeys;
  register: any;
  errors: FieldErrors<UserType>;
  required?: boolean;
  autoComplete?: string;
}

const InputText = memo(
  ({
    errors,
    register,
    name,
    required = false,
    autoComplete = '',
    hidden,
    ...rest
  }: InputTextProps) => {
    const { sessionRef } = useAuth();
    const theme = useTheme();

    const backgroundColor = useMemo(
      () => theme.palette.background.default,
      [theme],
    );

    const showError = useMemo(() => {
      const value = register(name).value;
      return value && value.length > 0 && errors[name];
    }, [errors, name, register]);

    if (hidden) {
      return null;
    }

    return (
      <TextField
        sx={{
          backgroundColor,
        }}
        id={name}
        label={labels[name]}
        {...register(name)}
        error={!!showError}
        helperText={showError?.message?.toString()}
        required={required}
        autoComplete={autoComplete}
        defaultValue={sessionRef?.user?.user_metadata[name]}
        fullWidth
        {...rest}
      />
    );
  },
);

export default InputText;
