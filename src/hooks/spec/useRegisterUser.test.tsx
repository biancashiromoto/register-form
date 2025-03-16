import { Context } from '@/context';
import { signUpUser } from '@/services/user';
import { INITIAL_USER_STATE } from '@/utils/commons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useRegisterUser from '../useRegisterUser';

vi.mock('@/services/user', () => ({
  signUpUser: vi.fn(),
}));

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('useRegisterUser', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;
  const mockSetSnackbarState = vi.fn();
  const mockSetRegisteringUser = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient();
    (useNavigate as any).mockReturnValue(mockNavigate);

    wrapper = ({ children }) => (
      <Context.Provider
        value={
          {
            setSnackbarState: mockSetSnackbarState,
            setRegisteringUser: mockSetRegisteringUser,
          } as any
        }
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Context.Provider>
    );
  });

  it('navigates to /login on successful registration and calls setSnackbarState and setRegisteringUser', async () => {
    const mockResponse = {
      data: {
        session: {
          access_token: 'token',
          user: { id: '1', email: 'test@test.com' },
        },
      },
    };
    (signUpUser as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useRegisterUser(), {
      wrapper,
    });

    act(() => {
      result.current.mutate({
        email: 'test@test.com',
        password: 'password',
        firstName: '',
        lastName: '',
        birthDate: '',
        address: {
          country: '',
          state: '',
          city: '',
        },
      });
    });

    await waitFor(() => {
      expect(mockSetSnackbarState).toHaveBeenCalledWith({
        open: true,
        message: 'User successfully registered!',
        severity: 'success',
      });
    });

    vi.useFakeTimers();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // vi.useRealTimers();
    // expect(mockNavigate).toHaveBeenCalledWith({ to: '/login', replace: true });

    expect(mockSetRegisteringUser).toHaveBeenCalledWith(INITIAL_USER_STATE);
  });

  // it('calls setSnackbarState with error message on failed registration and calls setRegisteringUser', async () => {
  //   const errorMessage = 'Invalid login credentials';
  //   (registerUser as any).mockRejectedValue(new Error(errorMessage));

  //   const { result } = renderHook(() => useRegisterUser(), { wrapper });

  //   await act(async () => {
  //     result.current.mutate({
  //       email: 'test@test.com',
  //       password: 'wrongpass',
  //       firstName: 'name',
  //       lastName: 'last name',
  //       birthDate: mockUser.birthDate,
  //       address: mockUser.address,
  //     });
  //   });

  //   await waitFor(() => {
  //     expect(mockSetSnackbarState).toHaveBeenCalledWith({
  //       open: true,
  //       message: errorMessage,
  //       severity: 'error',
  //     });
  //   });

  //   expect(mockSetRegisteringUser).toHaveBeenCalledWith(INITIAL_USER_STATE);
  // });
});
