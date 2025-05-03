import { FC, ReactNode } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Context } from '@/context';
import { resetPassword } from '@/services/user';
import { useNavigate } from '@tanstack/react-router';
import { ContextProps } from '@/context/index.types';
import { mockUser } from '@/tests/mocks';
import useResetPassword from '../useResetPassword';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/services/user', () => ({
  resetPassword: vi.fn(),
}));

describe('useResetPassword', () => {
  let setSnackbarStateMock: any;
  let navigateMock: any;
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    setSnackbarStateMock = vi.fn();
    navigateMock = vi.fn();
    (useNavigate as any).mockReturnValue(navigateMock);
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });
  });

  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <Context.Provider
      value={
        {
          setSnackbarState: setSnackbarStateMock,
        } as unknown as ContextProps
      }
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Context.Provider>
  );

  it('should successfully reset password', async () => {
    (resetPassword as any).mockResolvedValue({ success: true });
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.mutate(mockUser.password as string);
    });

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledTimes(1);
      expect(setSnackbarStateMock).toHaveBeenCalledWith({
        open: true,
        message: 'Password successfully updated!',
        severity: 'success',
      });
    });
  });

  it('should handle error when resetPassword fails', async () => {
    const errorMessage = 'Auth session missing!';
    (resetPassword as any).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.mutate(mockUser.password as string);
    });

    await waitFor(() => {
      expect(setSnackbarStateMock).toHaveBeenCalledWith({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    });
  });

  // it('should call sendResetPasswordEmail with valid email', async () => {
  //   const { result } = renderHook(() => useResetPassword(), { wrapper });

  //   act(() => {
  //     result.current.sendResetPasswordEmail(mockUser.email);
  //   });

  //   await waitFor(() => {
  //     expect(setSnackbarStateMock).toHaveBeenCalledWith({
  //       open: true,
  //       message: 'A password recovery email has been sent to your inbox.',
  //       severity: 'success',
  //     });
  //   });
  // });

  it('should handle invalid email', async () => {
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.sendResetPasswordEmail(undefined);
    });

    await waitFor(() => {
      expect(setSnackbarStateMock).toHaveBeenCalledWith({
        open: true,
        message: 'Please enter a valid email',
        severity: 'error',
      });
    });
  });
});
