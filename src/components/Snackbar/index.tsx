import { Context } from '@/context';
import { Alert, Snackbar as MuiSnackbar } from '@mui/material';
import { useContext } from 'react';

export const CustomSnackbar = () => {
  const { setSnackbarState, snackBarState } = useContext(Context);

  const handleClose = () => {
    setSnackbarState((prevState) => {
      return {
        ...prevState,
        open: false,
      };
    });
  };

  if (!snackBarState) return null;

  return (
    <MuiSnackbar
      data-testid="snackbar"
      open={snackBarState.open || false}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Alert
        onClose={handleClose}
        severity={snackBarState.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {snackBarState.message}
      </Alert>
    </MuiSnackbar>
  );
};
