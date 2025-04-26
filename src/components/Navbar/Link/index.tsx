import { Typography, useTheme } from '@mui/material';
import { Link as TanstackLink } from '@tanstack/react-router';

export interface LinkProps {
  shouldShow?: boolean;
  to?: string;
  onClick?: (() => void) | null;
  promptText: string;
  linkText: string;
}

const Link = ({
  shouldShow = true,
  to = '',
  onClick = null,
  promptText = '',
  linkText = '',
  ...rest
}: LinkProps) => {
  const theme = useTheme();
  return (
    shouldShow && (
      <Typography variant="body2">
        {promptText}{' '}
        <TanstackLink
          to={to}
          style={{
            color: theme.palette.text.secondary,
          }}
          onClick={(e) => {
            if (!onClick) return;
            e.preventDefault();
            onClick && onClick();
          }}
          {...rest}
        >
          {linkText}
        </TanstackLink>
      </Typography>
    )
  );
};

export default Link;
