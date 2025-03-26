import { useAuth } from '@/context/authContext';
import { Container, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { currentSession } = useAuth();

  return (
    currentSession && (
      <Container maxWidth="sm">
        <Typography variant="body2">
          You have successfully logged in!
        </Typography>
      </Container>
    )
  );
}
