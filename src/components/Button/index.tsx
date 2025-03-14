import { Button, ButtonBaseProps } from '@mui/material';
import { FC, ReactNode } from 'react';

export interface CustomButtonProps extends ButtonBaseProps {
  variant: 'text' | 'outlined' | 'contained';
  color:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  href?: string;
  children?: ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({
  className,
  variant,
  color,
  type = 'button',
  href,
  children,
  ...rest
}) => {
  return (
    <Button
      className={className || ''}
      variant={variant}
      color={color}
      href={href || undefined}
      component={href ? 'a' : 'button'}
      type={type}
      fullWidth
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
