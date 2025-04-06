import CustomBottomNavigation from '@/components/BottomNavigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import VerificationLayout from '@/components/VerificationLayout';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import Provider from '@/context/Provider';
import usePageTitle from '@/hooks/usePageTitle';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useContext } from 'react';

const RootLayout = () => {
  const { theme, isPrivateRoute } = useContext(Context);
  const { page } = usePageTitle();
  const { sessionRef } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <hr />
      <Container maxWidth="sm" sx={{ marginTop: '16px' }}>
        {((isPrivateRoute && sessionRef) ||
          (!isPrivateRoute && !sessionRef)) && (
          <Typography variant="h5" align="left" gutterBottom>
            {page?.title}
          </Typography>
        )}
      </Container>
      <Outlet />
      {isPrivateRoute && sessionRef && <CustomBottomNavigation />}
      <Footer />
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: () => (
    <Provider>
      <VerificationLayout>
        <RootLayout />
      </VerificationLayout>
    </Provider>
  ),
});
