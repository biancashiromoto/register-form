import App from '@/App';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const activeProps = { style: { fontWeight: 'bold' } };

const RootLayout = () => {
  return (
    <>
      <App />
      <nav>
        <Link to="/register" activeProps={activeProps}>
          Register
        </Link>
        {/* <Link to="/login" activeProps={activeProps}>
          Login
        </Link> */}
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
