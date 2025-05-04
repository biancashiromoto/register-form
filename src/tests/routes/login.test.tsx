import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { RouteComponent } from '@/routes/login';
import { supabase } from '@/services/supabase';
import { SignInWithPasswordCredentials, User } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSession, mockUser } from '../mocks';

const mockNavigate = vi.fn();
const mockSendResetPasswordEmail = vi.fn();
const mockSetSnackbarState = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/useResetPassword', () => ({
  default: () => ({
    sendResetPasswordEmail: mockSendResetPasswordEmail,
  }),
}));

describe('/login route', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const mockContext = {
    snackbarState: { open: false, message: '', severity: undefined },
    setSnackbarState: mockSetSnackbarState,
  } as unknown as ContextProps;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginRoute = () => {
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

  it('should sign in with correct data on form submission', async () => {
    renderLoginRoute();

    const signInSpy = vi
      .spyOn(supabase.auth, 'signInWithPassword')
      .mockResolvedValue({
        data: { user: mockUser as unknown as User, session: mockSession },
        error: null,
      });

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen
      .getByTestId('password')
      .querySelector('input')!;

    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    fireEvent.change(passwordInput, { target: { value: mockUser.password } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signInSpy).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
      } as SignInWithPasswordCredentials);
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/home' });
    });
  });

  it('should not call signIn for invalid email', async () => {
    renderLoginRoute();

    const signInSpy = vi.spyOn(supabase.auth, 'signInWithPassword');
    const emailInput = screen.getByLabelText(/e-mail/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signInSpy).not.toHaveBeenCalled();
    });
  });

  it('should call sendResetPasswordEmail when forgot password button is clicked', async () => {
    renderLoginRoute();

    const emailInput = screen.getByLabelText(/e-mail/i);
    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    fireEvent.click(
      screen.getByRole('button', { name: /forgot your password\?/i }),
    );

    await waitFor(() => {
      expect(mockSendResetPasswordEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });

  it('should handle error when signIn fails', async () => {
    renderLoginRoute();

    const error = { message: 'Error signing in' };
    vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
      error,
    } as any);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen
      .getByTestId('password')
      .querySelector('input')!;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSetSnackbarState).toHaveBeenCalledTimes(1);
      const updater = mockSetSnackbarState.mock.calls[0][0];

      const result = updater({ open: false, message: '', severity: undefined });

      expect(result).toEqual({
        open: true,
        message: error.message,
        severity: 'error',
      });
    });
  });
});
