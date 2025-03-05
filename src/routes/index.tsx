import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async () => {
    return redirect({ to: '/' });
  },
  component: () => <div>Hello world!</div>,
});
