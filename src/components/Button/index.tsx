import { Button, ButtonBaseProps } from '@mui/material';
import { FC, ReactNode } from 'react';

export interface CustomButtonProps extends ButtonBaseProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  href?: string;
  children?: ReactNode;
  fullWidth?: boolean;
  openInNewTab?: boolean;
}

const CustomButton: FC<CustomButtonProps> = ({
  className = '',
  variant = 'contained',
  color = 'primary',
  type = 'button',
  href = undefined,
  children,
  fullWidth = true,
  openInNewTab = true,
  ...rest
}) => {
  return (
    <Button
      className={className}
      variant={variant}
      color={color}
      href={href}
      component={href ? 'a' : 'button'}
      type={type}
      fullWidth={fullWidth}
      target={openInNewTab ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
