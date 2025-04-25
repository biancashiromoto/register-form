import { Container, Typography } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/authenticated/home')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) throw redirect({ to: '/unauthenticated' });
  },
});

export function RouteComponent() {
  return (
    <Container maxWidth="sm">
      <Typography variant="body2">You have successfully logged in!</Typography>
    </Container>
  );
}
