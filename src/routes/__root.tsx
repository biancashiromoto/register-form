import App from '@/App';
import { useAuth } from '@/context/authContext';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const activeProps = { style: { fontWeight: 'bold' } };

const RootLayout = () => {
  const { user } = useAuth();

  return (
    <>
      <App />
      <nav className="navbar">
        {!user && (
          <Link to="/register" activeProps={activeProps}>
            Register
          </Link>
        )}
        {!user && (
          <Link to="/login" activeProps={activeProps}>
            Login
          </Link>
        )}
        {user && (
          <Link to="/home" activeProps={activeProps}>
            Home
          </Link>
        )}
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
