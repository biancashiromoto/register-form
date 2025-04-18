import CustomBottomNavigation from '@/components/BottomNavigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import usePageTitle from '@/hooks/usePageTitle';
import { Container, Typography } from '@mui/material';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useContext } from 'react';

export const RootLayout = () => {
  const { isPrivateRoute } = useContext(Context);
  const { page } = usePageTitle();
  const { sessionRef } = useAuth();

  return (
    <>
      <Header />
      <hr />
      <Container maxWidth="sm" sx={{ marginTop: '16px', flex: 1 }}>
        <Typography variant="h5" align="left" gutterBottom>
          {page?.title}
        </Typography>
        <Outlet />
      </Container>
      {isPrivateRoute && sessionRef && <CustomBottomNavigation />}
      <Footer />
    </>
  );
};

export const Route = createRootRoute({
  component: () => <RootLayout />,
});
