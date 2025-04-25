import { labels } from '@/helpers/labels';
import { useAuthState } from '@/hooks/useAuthState';
import { TextField, useTheme } from '@mui/material';
import { ComponentProps, memo, useMemo } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

type LabelKeys = keyof typeof labels;

export interface InputTextProps extends ComponentProps<'input'> {
  name: LabelKeys;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
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
    const { session } = useAuthState();
    const theme = useTheme();

    const backgroundColor = useMemo(
      () => theme.palette.background.default,
      [theme],
    );

    const registration = register(name);
    const showError = useMemo(() => errors[name], [errors, name]);

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
        {...registration}
        error={!!showError}
        helperText={showError?.message?.toString()}
        required={required}
        autoComplete={autoComplete}
        defaultValue={session?.user?.user_metadata[name]}
        fullWidth
        {...rest}
      />
    );
  },
);

export default InputText;
