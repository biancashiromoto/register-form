import { useAuth } from '@/context/authContext';
import { Box, Container, Typography, Paper } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMemo } from 'react';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="70vh"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 60, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            {`Welcome back ${user?.user_metadata['first_name']}!`}
          </Typography>
          <Typography variant="body1">
            You have successfully logged in.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
