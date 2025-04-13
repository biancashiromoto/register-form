import { useAuth } from '@/context/authContext';
import { Container, Typography, useTheme } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import LoadingLayer from '../LoadingLayer';

const AlreadySignedIn = () => {
  const theme = useTheme();
  const { handleSignOut, isLoadingSignOut } = useAuth();

  const style = useMemo(() => {
    return { color: theme.palette.text.secondary };
  }, [theme]);

  if (isLoadingSignOut) return <LoadingLayer />;

  return (
    <Container maxWidth="sm">
      <Typography variant="body2">
        You're already signed in! Return to{' '}
        <Link style={style} to="/home">
          home page
        </Link>{' '}
        or{' '}
        <Link to="/login" onClick={handleSignOut} style={style}>
          sign out
        </Link>
      </Typography>
    </Container>
  );
};

export default AlreadySignedIn;
