import { createRoute, redirect } from '@tanstack/react-router';
import { Route as RootRoute } from '../__root';

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/register',
  loader: async () => {
    return redirect({ to: '/register/user' });
  },
});
