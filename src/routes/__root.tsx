import BottomNavigation from '@/components/BottomNavigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Provider from '@/context/Provider';
import { AuthState, useAuthState } from '@/hooks/useAuthState';
import usePageTitle from '@/hooks/usePageTitle';
import { supabase } from '@/services/supabase';
import { Container, Typography } from '@mui/material';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

type RouterContext = {
  authentication: AuthState;
};

export const RootLayout = () => {
  const { page } = usePageTitle();
  const { session } = useAuthState();
  const shouldRenderCustomBottomNavigation = session;

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
      {shouldRenderCustomBottomNavigation && <BottomNavigation />}
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
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    return { session: data.session };
  },
});
