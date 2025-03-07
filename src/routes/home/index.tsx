import { supabase } from '@/services/supabase';
import { Box, Button } from '@mui/material';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <Box width="100%" maxWidth="400px" mx="auto" mt={4} component="div">
      <h2>Home</h2>
      You have successfully logged in!
      <Button
        variant="text"
        color="primary"
        fullWidth
        style={{ marginTop: '24px' }}
        onClick={async () => {
          await supabase.auth.signOut();
          navigate({ to: '/login' });
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
