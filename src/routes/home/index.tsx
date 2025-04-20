import { isAuthenticated } from '@/services/user';
import { Container, Typography } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const auth = await isAuthenticated();

    if (!auth) {
      throw redirect({ to: '/unauthenticated' });
    }
  },
});

export function RouteComponent() {
  return (
    <Container maxWidth="sm">
      <Typography variant="body2">You have successfully logged in!</Typography>
    </Container>
  );
}
