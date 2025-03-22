import { UserType } from '@/types';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { ComponentProps, memo, useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

export interface InputPasswordProps extends ComponentProps<'input'> {
  register: any;
  errors: FieldErrors<UserType>;
  isConfirmPassword?: boolean;
  isExistingPassword?: boolean;
}

const InputPassword = memo(
  ({
    hidden,
    errors,
    register,
    isConfirmPassword = false,
    isExistingPassword = false,
  }: InputPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const passwordInputIdentification = isConfirmPassword
      ? 'confirmPassword'
      : 'password';

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.preventDefault();
    };

    const handleMouseUpPassword = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.preventDefault();
    };

    return (
      !hidden && (
        <FormControl
          variant="outlined"
          id={passwordInputIdentification}
          error={!!errors.password}
          fullWidth
        >
          <InputLabel htmlFor={passwordInputIdentification}>
            {isConfirmPassword ? 'Confirm password' : 'Password'}
          </InputLabel>
          <OutlinedInput
            aria-label={isConfirmPassword ? 'confirm password' : 'password'}
            autoComplete={isExistingPassword ? 'off' : 'new-password'}
            required
            {...register(`${passwordInputIdentification}`)}
            id={passwordInputIdentification}
            data-testid={isConfirmPassword ? 'confirm-password' : 'password'}
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
          {errors[passwordInputIdentification] && (
            <FormHelperText error>
              {errors[passwordInputIdentification]?.message}
            </FormHelperText>
          )}
        </FormControl>
      )
    );
  },
);

export default InputPassword;
