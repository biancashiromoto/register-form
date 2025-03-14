import { useAuth } from '@/context/authContext';
import { Box, Container } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    user && (
      <Container maxWidth="sm">You have successfully logged in!</Container>
    )
  );
}
