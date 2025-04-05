import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import useValidateResetLink from '../useValidateResetLink';
import { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/services/supabase';

vi.mock('@tanstack/react-router', () => ({
  ...vi.importActual('@tanstack/react-router'),
  useNavigate: vi.fn(),
}));

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('useValidateResetLink', () => {
  const mockSetSnackbarState = vi.fn();
  const mockContext = {
    setSnackbarState: mockSetSnackbarState,
  } as unknown as ContextProps;

  let queryClient: QueryClient;
  let navigateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    navigateMock = vi.fn();
    (useNavigate as any).mockReturnValue(navigateMock);
  });

  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <Context.Provider value={mockContext}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Context.Provider>
  );

  it('should validate reset password link successfully', async () => {
    window.location.hash = '#type=recovery&access_token=valid-token';
    (supabase.auth.getUser as any).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useValidateResetLink(), { wrapper });

    await waitFor(() =>
      expect(result.current.isLoadingValidateResetLink).toBe(false),
    );

    // expect(result.current.isValidResetLink).toBe(true);
    expect(navigateMock).not.toHaveBeenCalled();
    expect(mockSetSnackbarState).not.toHaveBeenCalled();
  });

  it('should handle an invalid reset link (missing access_token)', async () => {
    window.location.hash = '#type=recovery';
    const { result } = renderHook(() => useValidateResetLink(), { wrapper });

    await waitFor(() =>
      expect(result.current.isLoadingValidateResetLink).toBe(false),
    );

    expect(result.current.isValidResetLink).toBe(false);
    // expect(mockSetSnackbarState).toHaveBeenCalledWith({
    //   open: true,
    //   message: 'Invalid password reset link',
    //   severity: 'error',
    // });
    // expect(navigateMock).toHaveBeenCalledWith({ to: '/login' });
  });

  it('should handle supabase.getUser error', async () => {
    window.location.hash = '#type=recovery&access_token=invalid-token';
    const errorMsg = 'Some error occurred';
    (supabase.auth.getUser as any).mockResolvedValue({
      error: { message: errorMsg },
    });

    const { result } = renderHook(() => useValidateResetLink(), { wrapper });

    await waitFor(() =>
      expect(result.current.isLoadingValidateResetLink).toBe(false),
    );

    expect(result.current.isValidResetLink).toBe(false);
    // expect(mockSetSnackbarState).toHaveBeenCalledWith({
    //   open: true,
    //   message: errorMsg,
    //   severity: 'error',
    // });
    // expect(navigateMock).toHaveBeenCalledWith({ to: '/login' });
  });
});
