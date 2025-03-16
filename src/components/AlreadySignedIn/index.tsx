import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { Container, Typography, useTheme } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import LoadingLayer from '../LoadingLayer';

const AlreadySignedIn = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setUser, currentSession, setCurrentSession } = useAuth();
  const theme = useTheme();

  if (isLoggingOut) return <LoadingLayer />;

  return (
    <Container maxWidth="sm">
      <Typography variant="body2">
        You're already signed in! Return to{' '}
        <Link
          style={{
            color: theme.palette.text.secondary,
          }}
          to="/home"
        >
          home page
        </Link>{' '}
        or{' '}
        <Link
          to="/login"
          onClick={async () => {
            setIsLoggingOut(true);
            setUser(null);
            currentSession && (await supabase.auth.signOut());
            setCurrentSession(null);
            setIsLoggingOut(false);
          }}
          style={{
            color: theme.palette.text.secondary,
          }}
        >
          sign out
        </Link>
      </Typography>
    </Container>
  );
};

export default AlreadySignedIn;
