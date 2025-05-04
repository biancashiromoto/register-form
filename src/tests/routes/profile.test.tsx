import { Context } from '@/context';
import { AuthProvider } from '@/context/authContext';
import { ContextProps } from '@/context/index.types';
import { RouteComponent } from '@/routes/_authenticated/profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSession, mockUser } from '../mocks';

const mockSetSnackbarState = vi.fn();
const mockSendResetPasswordEmail = vi.fn();

const mockAuthState = {
  session: mockSession,
  signIn: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
};

vi.mock('@/hooks/useAuthState', () => ({
  useAuthState: () => mockAuthState,
}));

const mockUpdateUser = vi.fn();

vi.mock('@/hooks/useUpdateUser', () => ({
  default: () => ({
    mutate: mockUpdateUser,
    isPending: false,
  }),
}));

vi.mock('@/hooks/useResetPassword', () => ({
  default: () => ({
    sendResetPasswordEmail: mockSendResetPasswordEmail,
  }),
}));

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('/profile route', () => {
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

  const renderProfileRoute = () => {
    return render(
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Context.Provider value={mockContext}>
            <RouteComponent />
          </Context.Provider>
        </QueryClientProvider>
      </AuthProvider>,
    );
  };

  it('should render profile page', () => {
    renderProfileRoute();
    expect(screen.getByLabelText(/first name/i)).toHaveValue(
      mockUser.firstName,
    );
    expect(screen.getByLabelText(/last name/i)).toHaveValue(mockUser.lastName);
    expect(screen.getByLabelText(/birth date/i)).toHaveValue(
      mockUser.birthDate,
    );
    expect(screen.getByLabelText(/email/i)).toHaveValue(mockUser.email);
    expect(
      screen.getByRole('button', {
        name: /save/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /reset password/i,
      }),
    ).toBeInTheDocument();
  });

  it('should handle profile form filling', async () => {
    renderProfileRoute();

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Jane' },
    });

    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });

    const birthInput = screen.getByLabelText(/birth date/i);
    fireEvent.change(birthInput, { target: { value: '1990-09-09' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    await waitFor(() => expect(saveButton).not.toBeDisabled());

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSetSnackbarState).toHaveBeenCalledTimes(1);
      expect(mockUpdateUser).toHaveBeenCalledTimes(1);
      expect(mockUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
          birthDate: '1990-09-09',
          email: mockUser.email,
        }),
      );
    });
  });

  it('should call sendResetPasswordEmail when reset password button is clicked', async () => {
    renderProfileRoute();

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(mockSendResetPasswordEmail).toHaveBeenCalledWith(mockUser.email);
    });
  });
});
