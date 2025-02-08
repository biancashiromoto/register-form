import RegisterUser from '@/components/RegisterUser';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterUser />;
}
