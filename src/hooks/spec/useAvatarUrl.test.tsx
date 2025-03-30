// useAvatarUrl.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import useAvatarUrl from '../useAvatarUrl';
import { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/context/authContext';

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/services/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: 'https://example.com/avatar.png' },
        })),
      })),
    },
  },
}));

describe('useAvatarUrl', () => {
  const mockContext = {
    isPrivateRoute: false,
  } as unknown as ContextProps;
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    (useAuth as any).mockReturnValue({
      currentSession: {
        access_token: 'token',
        user: {
          id: 'userId',
          email: 'user@email.com',
          user_metadata: { avatar_url: 'avatar.png' },
        },
      },
    });
  });

  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <Context.Provider value={mockContext}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Context.Provider>
  );

  it('should successfully retrieve avatar', async () => {
    const { result } = renderHook(() => useAvatarUrl(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe('https://example.com/avatar.png');
  });

  it('should throw error when avatar path is missing', async () => {
    (useAuth as any).mockReturnValue({
      currentSession: {
        access_token: 'token',
        user: {
          id: 'userId',
          email: 'user@email.com',
          user_metadata: {
            avatar_url: null,
          },
        },
      },
    });
    const { result } = renderHook(() => useAvatarUrl(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    result.current.error &&
      expect(result.current.error.message).toBe('No avatar path');
  });
});
