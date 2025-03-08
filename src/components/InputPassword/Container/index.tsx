import { Box } from '@mui/material';
import InputPassword from '..';
import { FieldErrors } from 'react-hook-form';
import { UserType } from '@/types';

export type InputPasswordContainerProps = {
  shouldShow?: boolean;
  register: any;
  errors: FieldErrors<UserType>;
};

const InputPasswordContainer = ({
  shouldShow = true,
  register,
  errors,
}: InputPasswordContainerProps) => {
  return (
    shouldShow && (
      <Box display="flex" flexDirection="column" gap={2}>
        <InputPassword
          errors={errors}
          register={register}
          shouldShow={shouldShow}
        />
        <InputPassword
          errors={errors}
          register={register}
          shouldShow={shouldShow}
          isConfirmPassword
        />
      </Box>
    )
  );
};

export default InputPasswordContainer;
