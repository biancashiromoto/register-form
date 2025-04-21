import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthState, useAuthState } from './hooks/useAuthState';
import { useAuth } from './context/authContext';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    authentication: undefined!,
  },
});

const App = () => {
  const authentication = useAuthState();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ authentication }} />
    </QueryClientProvider>
  );
};

export default App;
