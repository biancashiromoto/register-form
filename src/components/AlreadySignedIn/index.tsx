import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { Container, Typography, useTheme } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import LoadingLayer from '../LoadingLayer';

const AlreadySignedIn = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setUser, currentSession } = useAuth();
  const theme = useTheme();

  const style = useMemo(() => {
    return { color: theme.palette.text.secondary };
  }, [theme]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setUser(null);
    currentSession && (await supabase.auth.signOut());
    setIsLoggingOut(false);
  };

  if (isLoggingOut) return <LoadingLayer />;

  return (
    <Container maxWidth="sm">
      <Typography variant="body2">
        You're already signed in! Return to{' '}
        <Link style={style} to="/home">
          home page
        </Link>{' '}
        or{' '}
        <Link to="/login" onClick={handleLogout} style={style}>
          sign out
        </Link>
      </Typography>
    </Container>
  );
};

export default AlreadySignedIn;
