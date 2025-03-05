import { Context } from '@/context';
import { Alert, Snackbar as MuiSnackbar } from '@mui/material';
import { useContext } from 'react';

export const CustomSnackbar = () => {
  const { setSnackbarState, snackbarState } = useContext(Context);

  const handleClose = () => {
    setSnackbarState((prevState) => {
      return {
        ...prevState,
        open: false,
      };
    });
  };

  if (!snackbarState) return null;

  return (
    <MuiSnackbar
      data-testid="snackbar"
      open={snackbarState.open || false}
      autoHideDuration={5000}
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
