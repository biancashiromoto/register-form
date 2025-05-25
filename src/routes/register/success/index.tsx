import CustomButton from '@/components/Button';
import { CustomSnackbar } from '@/components/Snackbar';
import { Context } from '@/context';
import { supabase } from '@/services/supabase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useContext } from 'react';

export const Route = createFileRoute('/register/success/')({
  component: RouteComponent,
});

export function RouteComponent() {
  const { registeringUser, setSnackbarState, snackbarState } =
    useContext(Context);
  const navigate = useNavigate();

  const resendConfirmationEmail = async () => {
    const { error } = await supabase.auth.resend({
      email: registeringUser?.email as string,
      type: 'signup',
    });

    setSnackbarState({
      message: error
        ? 'Error resending confirmation email'
        : 'Confirmation email resent!',
      open: true,
      severity: error ? 'error' : 'success',
    });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ textAlign: 'center', p: 2, boxShadow: 3 }}>
        <CardContent>
          <CheckCircleIcon
            sx={{ fontSize: 60, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Thank you for signing up!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            We've just sent you a confirmation email.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please check your inbox and spam folder for the confirmation email
            to activate your account.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <CustomButton href="/login" variant="contained">
              Sign In
            </CustomButton>
            <CustomButton
              variant="outlined"
              onClick={() => resendConfirmationEmail()}
            >
              Resend Confirmation Email
            </CustomButton>
          </Box>
        </CardContent>
      </Card>
      {snackbarState.open && (
        <CustomSnackbar onCloseCallback={() => navigate({ to: '/login' })} />
      )}
    </Container>
  );
}
