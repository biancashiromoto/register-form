import { Box } from '@mui/material';
import { ReactNode } from 'react';

type FormProps = {
  step: number;
  children: ReactNode;
};

const Form = ({ step, children }: FormProps) => {
  return (
    <Box>
      <h2>{`Step ${step}: Register user`}</h2>
      {children}
    </Box>
  );
};

export default Form;
