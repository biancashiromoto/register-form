import { createRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { Route as RootRoute } from '../__root';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/register',
  component: RouteComponent,
  loader: async () => {
    return redirect({ to: '/register/user' });
  },
});

function RouteComponent() {
  return (
    <div>
      <h1>Register</h1>
      <nav>
        <Link to="/register/user" className="[&.active]:font-bold">
          User
        </Link>
        <Link to="/register/address" className="[&.active]:font-bold">
          Address
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
