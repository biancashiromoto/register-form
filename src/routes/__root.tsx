import App from '@/App';
import { Context } from '@/context';
import usePageTitle from '@/hooks/usePageTitle';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useContext } from 'react';
const RootLayout = () => {
  const { theme } = useContext(Context);
  const { page } = usePageTitle();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <hr />
      <Container maxWidth="sm" sx={{ marginTop: '16px' }}>
        <Typography variant="h5" align="left">
          {page.title}
        </Typography>
      </Container>
      <Outlet />
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <div>NOT FOUND</div>,
});
