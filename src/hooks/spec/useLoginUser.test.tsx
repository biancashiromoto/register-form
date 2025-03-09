import { useAuth } from '@/context/authContext';
import { loginUser } from '@/services/user';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { vi } from 'vitest';
import useLoginUser from '../useLoginUser';

vi.mock('@/services/user', () => ({
  loginUser: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  ...vi.importActual('@tanstack/react-router'),
  useNavigate: vi.fn(),
}));

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}));

describe('useLoginUser', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockSetError = vi.fn();
  const mockNavigate = vi.fn();
  const mockSetUser = vi.fn();
  const mockSetCurrentSession = vi.fn();

  const userRef = { current: null as null | { id: string; email: string } };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useAuth as any).mockReturnValue({
      setUser: mockSetUser,
      setCurrentSession: mockSetCurrentSession,
      userRef,
    });
  });

  it('navigates to /home on successful login', async () => {
    const mockUser = { id: 'userId', email: 'user@example.com' };
    const mockSession = { access_token: 'token', user: mockUser };
    (loginUser as any).mockResolvedValue({ data: { session: mockSession } });

    const { result } = renderHook(() => useLoginUser(mockSetError), {
      wrapper,
    });

    act(() => {
      result.current.login({ email: 'user@example.com', password: 'pass' });
    });

    await waitFor(() => {
      userRef.current = mockUser;
      return userRef.current !== null;
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/home' });
    });
  });

  it('calls setError on login error', async () => {
    const errorMessage = 'Invalid login credentials';
    (loginUser as any).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLoginUser(mockSetError), {
      wrapper,
    });

    act(() => {
      result.current.login({
        email: 'user@example.com',
        password: 'wrongpass',
      });
    });

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('email', {
        type: 'manual',
        message: errorMessage,
      });
      expect(mockSetError).toHaveBeenCalledWith('password', {
        type: 'manual',
        message: errorMessage,
      });
    });
  });
});
