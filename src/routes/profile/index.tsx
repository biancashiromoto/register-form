import { useAuth } from '@/context/authContext';
import { Container, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  console.log(user);
  return (
    <Container maxWidth="sm">
      <Typography variant="body1" align="left" gutterBottom>
        Name:
        {`${user?.user_metadata.firstName} ${user?.user_metadata.lastName}`}
      </Typography>
      <Typography variant="body1" align="left" gutterBottom>
        Email: {user?.user_metadata.email}
      </Typography>
      <Typography variant="body1" align="left" gutterBottom>
        Birthdate:
        {new Date(user?.user_metadata.birthDate).toLocaleDateString()}
      </Typography>
    </Container>
  );
}
