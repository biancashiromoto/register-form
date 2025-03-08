import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { Box, Button } from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  return user ? (
    <Box width="100%" maxWidth="400px" mx="auto" mt={4} component="div">
      <h2>Home</h2>
      You have successfully logged in!
    </Box>
  ) : (
    <>
      <h2>Unauthenticated</h2>
      <p>
        Try to <Link to="/login">login</Link> again
      </p>
    </>
  );
}
