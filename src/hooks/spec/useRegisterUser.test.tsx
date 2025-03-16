import { FC, ReactNode } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Context } from '@/context';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { signUpUser } from '@/services/user';
import { useNavigate } from '@tanstack/react-router';
import { ContextProps } from '@/context/index.types';
import { mockUser } from '@/tests/mocks';
import useRegisterUser from '../useRegisterUser';

vi.mock('@/services/user');
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

describe('useRegisterUser', () => {
  let setSnackbarStateMock: any;
  let setRegisteringUserMock: any;
  let navigateMock: any;
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    setSnackbarStateMock = vi.fn();
    setRegisteringUserMock = vi.fn();
    navigateMock = vi.fn();
    (useNavigate as any).mockReturnValue(navigateMock);
    queryClient = new QueryClient();
  });

  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <Context.Provider
      value={
        {
          setSnackbarState: setSnackbarStateMock,
          setRegisteringUser: setRegisteringUserMock,
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
      expect(setSnackbarStateMock).toHaveBeenCalledWith({
        open: true,
        message: 'User successfully registered!',
        severity: 'success',
      });
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/login',
        replace: true,
        viewTransition: true,
      });
      expect(setRegisteringUserMock).toHaveBeenCalledWith(INITIAL_USER_STATE);
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
      expect(setRegisteringUserMock).toHaveBeenCalledWith(INITIAL_USER_STATE);
    });
  });
});
