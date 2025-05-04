import { supabase } from '@/services/supabase';
import { mockSession, mockUser } from '@/tests/mocks';
import { AuthSession } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { FC, ReactNode } from 'react';
import { useAuthState } from '../useAuthState';

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

describe('useAuthState full coverage', () => {
  let queryClient: QueryClient;

  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
  });

  it('should get session successfully', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
    });

    const { result } = renderHook(() => useAuthState(), { wrapper });
    await act(() => result.current.getSession());

    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(result.current.session).toEqual(mockSession);
    });
  });

  it('should return null if session is missing', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useAuthState(), { wrapper });
    const session = await result.current.getSession();

    expect(session).toBeNull();
    expect(result.current.session).toBeNull();
  });

  it('should sign in successfully', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { session: mockSession },
    });

    const { result } = renderHook(() => useAuthState(), { wrapper });

    await act(async () => {
      await result.current.signIn({
        email: mockUser.email,
        password: '123456',
      });
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: mockUser.email,
      password: '123456',
    });
    expect(result.current.session).toEqual(mockSession);
  });

  it('should throw error when sign in fails', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: null,
    });

    const { result } = renderHook(() => useAuthState(), { wrapper });

    await expect(
      result.current.signIn({
        email: mockUser.email,
        password: 'wrongpass',
      }),
    ).rejects.toThrow('Error signing in');
  });

  it('should call signOut', async () => {
    const { result } = renderHook(() => useAuthState(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should call onAuthStateChange with TOKEN_REFRESHED', () => {
    (supabase.auth.onAuthStateChange as any).mockImplementationOnce(
      (cb: any) => {
        cb('TOKEN_REFRESHED', null);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
    );

    renderHook(() => useAuthState(), { wrapper });

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
  });

  it('should call onAuthStateChange with USER_UPDATED', () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: mockSession },
    });
    (supabase.auth.onAuthStateChange as any).mockImplementationOnce(
      (cb: any) => {
        cb('USER_UPDATED', mockSession as AuthSession);
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
    );

    renderHook(() => useAuthState(), { wrapper });

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    expect(supabase.auth.getSession).toHaveBeenCalled();
  });
});
