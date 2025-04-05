import { useAuth } from '@/context/authContext';
import { Container, Typography } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { currentSession } = useAuth();
  const navigate = useNavigate();

  if (!currentSession) navigate({ to: '/unauthenticated' });

  return (
    <Container maxWidth="sm">
      <Typography variant="body2">You have successfully logged in!</Typography>
    </Container>
  );
}
