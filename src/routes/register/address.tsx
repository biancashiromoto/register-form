import { createRoute } from '@tanstack/react-router';
import { Route as RegisterRoute } from '.';

export const Route = createRoute({
  getParentRoute: () => RegisterRoute,
  path: 'address',
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Register address</div>;
}
