import App from '@/App';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const RootLayout = () => {
  return (
    <>
      <App />
      <hr />
      <Outlet />
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <div>NOT FOUND</div>,
});
