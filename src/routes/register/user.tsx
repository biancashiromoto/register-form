import { createRoute } from '@tanstack/react-router';
import { Route as RegisterRoute } from '.';
import RegisterUser from '@/components/RegisterUser';

export const Route = createRoute({
  getParentRoute: () => RegisterRoute,
  path: 'user',
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterUser />;
}
