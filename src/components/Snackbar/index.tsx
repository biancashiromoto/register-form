import { Snackbar as MuiSnackbar } from '@mui/material';

type CustomSnackbarProps = {
  openSnackbar: boolean;
  setOpenSnackbar: (open: boolean) => void;
  message: string;
};

export const CustomSnackbar = ({
  openSnackbar,
  setOpenSnackbar,
  message,
}: CustomSnackbarProps) => {
  return (
    <MuiSnackbar
      open={openSnackbar}
      autoHideDuration={5000}
      onClose={() => setOpenSnackbar(false)}
      message={message}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    />
  );
};
