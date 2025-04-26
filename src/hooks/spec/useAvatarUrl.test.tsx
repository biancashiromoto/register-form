import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { FC, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useAvatarUrl from '../useAvatarUrl';
import { mockSession } from '@/tests/mocks';
import * as AuthState from '@/hooks/useAuthState';

vi.mock('@/hooks/useAuthState', () => ({
  useAuthState: () => ({ session: mockSession, signOut: vi.fn() }),
}));

vi.mock('@/services/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: mockSession.user.user_metadata.avatar_url },
          error: null,
        })),
      })),
    },
  },
}));

describe('useAvatarUrl', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should successfully retrieve avatar', async () => {
    const { result } = renderHook(() => useAvatarUrl(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(mockSession.user.user_metadata.avatar_url);
  });

  it('should throw error when avatar path is missing', async () => {
    vi.spyOn(AuthState, 'useAuthState').mockReturnValue({
      session: null,
      signOut: vi.fn(),
    } as unknown as AuthState.AuthState);

    const { result } = renderHook(() => useAvatarUrl(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    result.current.error &&
      expect(result.current.error.message).toBe('No avatar path');
  });
});
