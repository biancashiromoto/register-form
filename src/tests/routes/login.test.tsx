import { Context } from '@/context';
import * as authContext from '@/context/authContext';
import { ContextProps } from '@/context/index.types';
import { AuthState } from '@/hooks/useAuthState';
import useLoginUser from '@/hooks/useLoginUser';
import { RouteComponent } from '@/routes/login';
import { Session } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSession, mockUser } from '../mocks';

const mockNavigate = vi.fn();
const mockSendResetPasswordEmail = vi.fn();
const mockLoginMutate = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/useLoginUser', () => ({
  default: vi.fn(),
}));

vi.mock('@/hooks/useResetPassword', () => ({
  default: () => ({
    sendResetPasswordEmail: mockSendResetPasswordEmail,
  }),
}));

vi.mock('@/components/AlreadySignedIn', () => ({
  default: () => (
    <div data-testid="already-signed-in">You're already signed in!</div>
  ),
}));

describe('/login route', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const mockContext = {
    snackbarState: {
      open: false,
      message: '',
      severity: undefined,
    },
  } as unknown as ContextProps;

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoginUser as any).mockReturnValue({
      mutate: mockLoginMutate,
      isPending: false,
    });
  });

  const renderLoginRoute = (sessionRef: Session | null = null) => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      sessionRef,
    } as AuthState);

    return render(
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={mockContext}>
          <RouteComponent />
        </Context.Provider>
      </QueryClientProvider>,
    );
  };

  it('should render login form when user is not authenticated', () => {
    renderLoginRoute();

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /forgot your password\?/i }),
    ).toBeInTheDocument();
  });

  it('should render AlreadySignedIn component when user is authenticated', () => {
    renderLoginRoute(mockSession);
    expect(screen.getByText(/you're already signed in!/i)).toBeInTheDocument();
  });

  it('should show loading state while login is in progress', () => {
    (useLoginUser as any).mockReturnValue({
      mutate: mockLoginMutate,
      isPending: true,
    });

    renderLoginRoute();
    expect(screen.getByTestId('loading-img')).toBeInTheDocument();
  });

  it('should call login mutation with correct data on form submission', async () => {
    renderLoginRoute();

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByTestId('password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    fireEvent.change(passwordInput.firstChild as Element, {
      target: { value: mockUser.password },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginMutate).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
      });
    });
  });

  it('should show validation errors for invalid email', async () => {
    renderLoginRoute();

    const emailInput = screen.getByLabelText(/e-mail/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(mockLoginMutate).not.toHaveBeenCalled();
  });

  it('should call sendResetPasswordEmail when forgot password button is clicked', async () => {
    renderLoginRoute();

    const emailInput = screen.getByLabelText(/e-mail/i);
    const forgotPasswordButton = screen.getByRole('button', {
      name: /forgot your password\?/i,
    });

    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    fireEvent.click(forgotPasswordButton);

    await waitFor(() => {
      expect(mockSendResetPasswordEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });
});
