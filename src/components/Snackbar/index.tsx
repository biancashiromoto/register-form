import { Context } from '@/context';
import { Alert, Snackbar as MuiSnackbar } from '@mui/material';
import { useContext } from 'react';

const SNACKBAR_DURATION = 2500;

type CustomSnackbarProps = {
  onCloseCallback?: () => void;
};

export const CustomSnackbar = ({
  onCloseCallback = undefined,
}: CustomSnackbarProps) => {
  const { handleCloseSnackbar, snackbarState } = useContext(Context);

  const handleClose = () => {
    handleCloseSnackbar();
    onCloseCallback && onCloseCallback();
  };

  return (
    <MuiSnackbar
      data-testid="snackbar"
      open={snackbarState.open ?? false}
      autoHideDuration={SNACKBAR_DURATION}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbarState.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackbarState.message}
      </Alert>
    </MuiSnackbar>
  );
};
