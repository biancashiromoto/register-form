import CustomBottomNavigation from '@/components/BottomNavigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Context } from '@/context';
import { AuthProvider, useAuth } from '@/context/authContext';
import Provider from '@/context/Provider';
import { AuthState } from '@/hooks/useAuthState';
import usePageTitle from '@/hooks/usePageTitle';
import { supabase } from '@/services/supabase';
import { Container, Typography } from '@mui/material';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { useContext } from 'react';

type AuthContext = {
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

export const Route = createRootRouteWithContext<AuthContext>()({
  component: () => (
    <Provider>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </Provider>
  ),
  loader: async () => {
    const { data } = await supabase.auth.getSession();
    return { session: data.session };
  },
});
