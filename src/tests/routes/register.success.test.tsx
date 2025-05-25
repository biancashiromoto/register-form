import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { RouteComponent } from '@/routes/register/success';
import { supabase } from '@/services/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();
const mockSetSnackbarState = vi.fn();
const mockSetUserLocation = vi.fn();

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

describe('/register route', async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const mockContext = {
    snackbarState: { open: false, message: '', severity: undefined },
    setUserLocation: mockSetUserLocation,
    setSnackbarState: mockSetSnackbarState,
  } as unknown as ContextProps;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderRegisterSuccessRoute = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={mockContext}>
          <RouteComponent />
        </Context.Provider>
      </QueryClientProvider>,
    );
  };

  it('should be correctly rendered', async () => {
    const resendMock = supabase.auth.resend as unknown as vi.Mock;
    resendMock.mockResolvedValueOnce({ error: null });

    renderRegisterSuccessRoute();

    fireEvent.click(
      screen.getByRole('button', { name: /resend confirmation email/i }),
    );
    await waitFor(() => {
      expect(resendMock).toHaveBeenCalledOnce();
      expect(mockSetSnackbarState).toHaveBeenCalledWith({
        message: 'Confirmation email resent!',
        open: true,
        severity: 'success',
      });
    });

    expect(screen.getByText(/Thank you for signing up!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/We've just sent you a confirmation email./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Please check your inbox and spam folder for the confirmation email to activate your account./i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});
