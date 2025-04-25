import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AuthProvider } from './context/authContext';
import { useAuthState } from './hooks/useAuthState';
import { routeTree } from './routeTree.gen';

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
      <AuthProvider>
        <RouterProvider router={router} context={{ authentication }} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
