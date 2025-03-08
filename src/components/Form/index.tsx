import { Box } from '@mui/material';
import { ReactNode } from 'react';

type FormProps = {
  children: ReactNode;
};

const Form = ({ children }: FormProps) => {
  return <Box>{children}</Box>;
};

export default Form;
