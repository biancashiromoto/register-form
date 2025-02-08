import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async () => {
    return redirect({ to: '/register' });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return;
}
