import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { RouteComponent } from '@/routes/reset-password';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockUser } from '../mocks';

const mockNavigate = vi.fn();
const mockResetPassword = vi.fn();
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
    mutate: mockResetPassword,
    isPending: false,
  }),
}));

describe('/reset-password route', () => {
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

  const renderResetPasswordRoute = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={mockContext}>
          <RouteComponent />
        </Context.Provider>
      </QueryClientProvider>,
    );
  };

  it('should render reset password form', () => {
    renderResetPasswordRoute();
    const newPassword = screen.getByTestId('password');
    expect(
      within(newPassword).getByLabelText(/new password/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /update password/i,
      }),
    ).toBeInTheDocument();
  });

  it('should handle password form filling', async () => {
    renderResetPasswordRoute();
    const newPassword = screen.getByTestId('password');
    fireEvent.change(within(newPassword).getByLabelText(/new password/i), {
      target: { value: mockUser.password },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: mockUser.password },
    });
    fireEvent.click(
      screen.getByRole('button', {
        name: /update password/i,
      }),
    );

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(mockUser.password);
    });
  });
});
