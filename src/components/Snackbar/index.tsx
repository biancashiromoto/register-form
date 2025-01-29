import { Context } from '@/context';
import { Snackbar as MuiSnackbar } from '@mui/material';
import { useContext } from 'react';

export const CustomSnackbar = () => {
  const { setSnackbarState, snackBarState } = useContext(Context);
  return (
    <MuiSnackbar
      open={snackBarState.open}
      autoHideDuration={5000}
      onClose={() =>
        setSnackbarState((prevState) => {
          return {
            ...prevState,
            open: false,
          };
        })
      }
      message={snackBarState.message}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    />
  );
};
