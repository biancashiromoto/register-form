import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { renderHook, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import usePageTitle from '../usePageTitle';

vi.mock('@tanstack/react-router', () => ({
  useLocation: vi.fn(),
}));

describe('usePageTitle', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correct page title', async () => {
    (useLocation as any).mockReturnValue({ pathname: '/home' });

    const { result } = renderHook(() => usePageTitle(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.page.title).toBe('Home');
    });
  });
});
