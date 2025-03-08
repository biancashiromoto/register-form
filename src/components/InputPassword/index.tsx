import { UserType } from '@/types';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { useState } from 'react';
import { FieldErrors } from 'react-hook-form';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

export type InputPasswordProps = {
  shouldShow?: boolean;
  register: any;
  errors: FieldErrors<UserType>;
  isConfirmPassword?: boolean;
};

const InputPassword = ({
  shouldShow = true,
  errors,
  register,
  isConfirmPassword = false,
}: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
    shouldShow && (
      <FormControl
        sx={{ width: '100%' }}
        variant="outlined"
        id={isConfirmPassword ? 'confirmPassword' : 'password'}
        error={!!errors.password}
      >
        <InputLabel htmlFor="password">
          {isConfirmPassword ? 'Confirm password' : 'Password'}
        </InputLabel>
        <OutlinedInput
          autoComplete={!isConfirmPassword ? 'new-password' : 'off'}
          required
          {...register(`${isConfirmPassword ? 'confirmPassword' : 'password'}`)}
          id={isConfirmPassword ? 'confirmPassword' : 'password'}
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
        {errors[isConfirmPassword ? 'confirmPassword' : 'password'] && (
          <FormHelperText error>
            {
              errors[isConfirmPassword ? 'confirmPassword' : 'password']
                ?.message
            }
          </FormHelperText>
        )}
      </FormControl>
    )
  );
};

export default InputPassword;
