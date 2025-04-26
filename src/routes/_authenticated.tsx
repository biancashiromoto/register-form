import BottomNavigation from '@/components/BottomNavigation';
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  component: () => (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  ),
  beforeLoad: async ({ context }) => {
    if (!context.session) throw redirect({ to: '/unauthenticated' });
  },
});
