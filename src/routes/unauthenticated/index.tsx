import CustomButton from '@/components/Button';
import { Box, Container, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/unauthenticated/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h3" fontSize={32} gutterBottom>
        Oops, you are not authenticated!
      </Typography>
      <Typography variant="body1" gutterBottom>
        It seems you are not logged in. To acces this page, please login or
        register.
      </Typography>
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexDirection: 'column',
        }}
      >
        <CustomButton href="/login" openInNewTab={false}>
          Login
        </CustomButton>
        <CustomButton variant="outlined" href="/register" openInNewTab={false}>
          Register
        </CustomButton>
      </Box>
    </Container>
  );
}
