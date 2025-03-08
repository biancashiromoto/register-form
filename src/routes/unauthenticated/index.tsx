import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/unauthenticated/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <h2>Unauthenticated</h2>;
}
