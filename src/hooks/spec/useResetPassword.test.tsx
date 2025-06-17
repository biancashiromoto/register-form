import { FC, ReactNode } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Context } from '@/context';
import { resetPassword } from '@/services/user';
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
  let handleOpenSnackbarMock: any;
  let signOutMock: any;
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    handleOpenSnackbarMock = vi.fn();
    signOutMock = vi.fn();

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
          handleOpenSnackbar: handleOpenSnackbarMock,
          signOut: signOutMock,
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
      expect(handleOpenSnackbarMock).toHaveBeenCalledWith({
        message: 'Password successfully updated!',
        severity: 'success',
      });
    });
  });

  it('should handle error when resetPassword fails', async () => {
    const errorMessage = 'Auth session missing!';
    const error = new Error(errorMessage);
    (resetPassword as any).mockRejectedValue(error);

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.mutate(mockUser.password as string);
    });

    await waitFor(() => {
      expect(handleOpenSnackbarMock).toHaveBeenCalledWith({
        ...error,
        severity: 'error',
      });
    });
  });

  it('should handle invalid email', async () => {
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    act(() => {
      result.current.sendResetPasswordEmail(undefined);
    });

    await waitFor(() => {
      expect(handleOpenSnackbarMock).toHaveBeenCalledWith({
        message: 'Please enter a valid email',
        severity: 'error',
      });
    });
  });
});
