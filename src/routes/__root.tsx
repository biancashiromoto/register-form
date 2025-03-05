import App from '@/App';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { useEffect } from 'react';

const RootLayout = () => {
  useEffect(() => {
    console.log('VITE_PROJECT_URL:', process.env.VITE_PROJECT_URL);
  }, []);

  return (
    <>
      <App />
      <nav>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
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
