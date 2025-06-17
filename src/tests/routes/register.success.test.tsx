import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { RouteComponent } from '@/routes/register/success';
import { supabase } from '@/services/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();
const mockHandleOpenSnackbar = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/services/supabase', async () => {
  const actual = await vi.importActual('@/services/supabase');
  return {
    ...actual,
    supabase: {
      ...actual.supabase,
      auth: {
        ...actual.supabase.auth,
        resend: vi.fn(),
      },
    },
  };
});

describe('/register/success route', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockContext = {
    registeringUser: { email: 'test@example.com' },
    snackbarState: { open: true, message: '', severity: undefined },
    handleOpenSnackbar: mockHandleOpenSnackbar,
  } as unknown as ContextProps;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSuccessPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={mockContext}>
          <RouteComponent />
        </Context.Provider>
      </QueryClientProvider>,
    );
  };

  it('should render success page and resend confirmation email', async () => {
    const resendMock = supabase.auth.resend as unknown as vi.Mock;
    resendMock.mockResolvedValueOnce({ error: null });

    renderSuccessPage();

    fireEvent.click(
      screen.getByRole('button', { name: /resend confirmation email/i }),
    );

    await waitFor(() => {
      expect(resendMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        type: 'signup',
      });

      expect(mockHandleOpenSnackbar).toHaveBeenCalledWith({
        message: 'Confirmation email resent!',
        severity: 'success',
      });
    });

    expect(screen.getByText(/thank you for signing up/i)).toBeInTheDocument();
    expect(
      screen.getByText(/we've just sent you a confirmation email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please check your inbox and spam folder/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});
