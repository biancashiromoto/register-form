import CustomBottomNavigation from '@/components/BottomNavigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Context } from '@/context';
import { useAuth } from '@/context/authContext';
import Provider from '@/context/Provider';
import { AuthState } from '@/hooks/useAuthState';
import usePageTitle from '@/hooks/usePageTitle';
import { Container, Typography } from '@mui/material';
import {
  createRootRoute,
  createRootRouteWithContext,
  Outlet,
} from '@tanstack/react-router';
import { useContext } from 'react';

type RouterContext = {
  authentication: AuthState;
};

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

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Provider>
      <RootLayout />
    </Provider>
  ),
});
