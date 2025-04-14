import { UserType } from '@/types';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { ComponentProps, memo, MouseEvent, useCallback, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

export interface InputPasswordProps extends ComponentProps<'input'> {
  register: any;
  errors: FieldErrors<UserType>;
  isConfirmPassword?: boolean;
  isExistingPassword?: boolean;
  label?: string;
  name?: string;
}

const InputPassword = memo(
  ({
    hidden,
    errors,
    register,
    isConfirmPassword = false,
    isExistingPassword = false,
    label,
    name,
  }: InputPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const passwordInputIdentification =
      name || (isConfirmPassword ? 'confirmPassword' : 'password');

    const passwordInputLabel =
      label || (isConfirmPassword ? 'Confirm password' : 'Password');

    const handleClickShowPassword = useCallback(
      () => setShowPassword((show) => !show),
      [],
    );

    const handleMouseDownPassword = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      },
      [],
    );

    const handleMouseUpPassword = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      },
      [],
    );

    return (
      !hidden && (
        <FormControl
          variant="outlined"
          error={
            !!errors[passwordInputIdentification as keyof FieldErrors<UserType>]
          }
          fullWidth
        >
          <InputLabel htmlFor={passwordInputIdentification}>
            {passwordInputLabel}
          </InputLabel>
          <OutlinedInput
            autoComplete={isExistingPassword ? 'off' : 'new-password'}
            required
            {...register(`${passwordInputIdentification}`)}
            id={passwordInputIdentification}
            name={passwordInputIdentification}
            data-testid={passwordInputIdentification}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                </IconButton>
              </InputAdornment>
            }
            label={isConfirmPassword ? 'Confirm password' : 'Password'}
          />
          {!!errors[
            passwordInputIdentification as keyof FieldErrors<UserType>
          ] && (
            <FormHelperText error>
              {
                errors[
                  passwordInputIdentification as keyof FieldErrors<UserType>
                ]?.message
              }
            </FormHelperText>
          )}
        </FormControl>
      )
    );
  },
);

export default InputPassword;
