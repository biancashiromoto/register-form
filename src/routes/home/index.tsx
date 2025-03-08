import { useAuth } from '@/context/authContext';
import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  return (
    user && (
      <Box width="100%" maxWidth="400px" mx="auto" mt={4} component="div">
        <h2>Home</h2>
        You have successfully logged in!
      </Box>
    )
  );
}
