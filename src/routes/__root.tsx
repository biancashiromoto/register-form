import App from '@/App';
import Navbar from '@/components/Navbar';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <App />
      <hr style={{ width: '400px', margin: '0 auto' }} />
      <Outlet />
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <div>NOT FOUND</div>,
});
