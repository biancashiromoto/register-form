import { Backdrop, CircularProgress } from '@mui/material';

export interface LoadingLayerProps {
  open?: boolean;
  handleClose?: () => void;
}

const LoadingLayer = ({ handleClose, open = true }: LoadingLayerProps) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={open}
      onClick={handleClose || undefined}
    >
      <CircularProgress data-testid="loading-img" color="inherit" />
    </Backdrop>
  );
};

export default LoadingLayer;
