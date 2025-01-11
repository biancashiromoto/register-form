import { Box, TextField } from '@mui/material';

export type InputTextProps = {
  shouldShow: boolean;
  errors: any;
  register: any;
  name: string;
};

const InputText = ({
  shouldShow = true,
  errors,
  register,
  name,
}: InputTextProps) => {
  return (
    shouldShow && (
      <Box mb={2}>
        <TextField
          id={name}
          label={name}
          fullWidth
          {...register(name)}
          error={!!errors[name]}
          helperText={errors[name]?.message?.toString()}
        />
      </Box>
    )
  );
};

export default InputText;
