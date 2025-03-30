import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { signUpUser } from '@/services/user';
import { mockUser } from '@/tests/mocks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { act, renderHook, waitFor } from '@testing-library/react';
import { FC, ReactNode } from 'react';
import useRegisterUser from '../useRegisterUser';

vi.mock('@/services/user');
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

describe('useRegisterUser', () => {
  let setSnackbarStateMock: any;
  let navigateMock: any;
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    setSnackbarStateMock = vi.fn();
    navigateMock = vi.fn();
    (useNavigate as any).mockReturnValue(navigateMock);
    queryClient = new QueryClient();
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

  it('should successfully register user', async () => {
    (signUpUser as any).mockResolvedValue({ success: true });
    const { result } = renderHook(() => useRegisterUser(), { wrapper });

    act(() => {
      result.current.mutate(mockUser);
    });

    await waitFor(() => {
      expect(signUpUser).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/register/success',
        replace: true,
        viewTransition: true,
      });
    });
  });

  it('should handle error', async () => {
    const errorMessage = 'Error registering';
    (signUpUser as any).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useRegisterUser(), { wrapper });

    act(() => {
      result.current.mutate(mockUser);
    });

    await waitFor(() => {
      expect(setSnackbarStateMock).toHaveBeenCalledWith({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    });
  });
});
