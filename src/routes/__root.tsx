import App from '@/App';
import { Context } from '@/context';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useContext } from 'react';

const RootLayout = () => {
  const { theme } = useContext(Context);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <hr />
      <Outlet />
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <div>NOT FOUND</div>,
});
