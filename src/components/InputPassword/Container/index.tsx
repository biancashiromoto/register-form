import { Box } from '@mui/material';
import InputPassword from '..';
import { FieldErrors } from 'react-hook-form';
import { UserType } from '@/types';

export type InputPasswordContainerProps = {
  hidden?: boolean;
  register: any;
  errors: FieldErrors<UserType>;
};

const InputPasswordContainer = ({
  hidden = false,
  register,
  errors,
}: InputPasswordContainerProps) => {
  return (
    !hidden && (
      <Box width={'100%'} display="flex" flexDirection="column" gap={2}>
        <InputPassword errors={errors} register={register} />
        <InputPassword errors={errors} register={register} isConfirmPassword />
      </Box>
    )
  );
};

export default InputPasswordContainer;
