import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { RouteComponent } from '@/routes/register';
import { supabase } from '@/services/supabase';
import { SignInWithPasswordCredentials, User } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSession, mockUser } from '../mocks';

const mockNavigate = vi.fn();
const mockSetSnackbarState = vi.fn();
const mockRegisterUser = vi.fn();
const mockSetUserLocation = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/useRegisterUser', () => ({
  default: () => ({
    mutate: mockRegisterUser,
    isPending: false,
  }),
}));

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

  const renderRegisterRoute = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={mockContext}>
          <RouteComponent />
        </Context.Provider>
      </QueryClientProvider>,
    );
  };

  it('should render first name input and handle form filling', async () => {
    renderRegisterRoute();

    const firstNameInput = screen.getByRole('textbox', {
      name: /first name/i,
    });
    expect(firstNameInput).toBeInTheDocument();
    expect(firstNameInput).toHaveValue('');

    expect(
      screen.queryByRole('textbox', {
        name: /last name/i,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /clear form/i,
      }),
    ).toBeInTheDocument();

    fireEvent.change(firstNameInput, { target: { value: mockUser.firstName } });

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /last name/i,
      }),
      { target: { value: mockUser.lastName } },
    );

    fireEvent.change(screen.getByLabelText(/birth date/i), {
      target: { value: mockUser.birthDate },
    });

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /e\-mail/i,
      }),
      { target: { value: mockUser.email } },
    );

    fireEvent.click(
      screen.getByRole('checkbox', { name: /Add location information/i }),
    );
    expect(screen.getByTestId('user-location')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('checkbox', { name: /Add location information/i }),
    );

    expect(screen.queryByTestId('user-location')).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('checkbox', { name: /Add location information/i }),
    );

    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'Bra' },
    });
    fireEvent.click(await screen.findByText('Brazil'));

    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'São' },
    });
    fireEvent.click(await screen.findByText('São Paulo'));

    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'São' },
    });
    fireEvent.click(
      await screen.findByRole('option', {
        name: /são paulo/i,
      }),
    );

    const passwordInput = screen.getByTestId('password');
    fireEvent.change(passwordInput.firstChild!, {
      target: { value: mockUser.password },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: mockUser.password },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(mockSetSnackbarState).toHaveBeenCalledOnce();

    await waitFor(() => expect(mockRegisterUser).toHaveBeenCalledOnce());
  });

  it('should handle click on "Clear form" button', async () => {
    renderRegisterRoute();

    const firstNameInput = screen.getByRole('textbox', {
      name: /first name/i,
    });

    fireEvent.change(firstNameInput, { target: { value: mockUser.firstName } });
    expect(firstNameInput).toHaveValue(mockUser.firstName);

    fireEvent.click(
      screen.getByRole('button', {
        name: /clear form/i,
      }),
    );

    expect(firstNameInput).toHaveValue('');
  });
});
