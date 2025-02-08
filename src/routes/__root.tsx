import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Link to="/" className="[&.active]:font-bold">
          Register
        </Link>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
      </nav>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
