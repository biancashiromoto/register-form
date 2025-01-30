import { mockUser } from '@/tests/mocks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RegisterUser from '..';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('RegisterUser component', () => {
  const queryClient = new QueryClient();
  const mockSetSnackbarState = vi.fn();
  const mockContext = {
    setSnackbarState: mockSetSnackbarState,
    snackBarState: {
      open: true,
      severity: 'success',
      message: 'User successfully registered',
    },
  } as unknown as ContextProps;
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (context = mockContext) => {
    render(
      <QueryClientProvider client={queryClient}>
        <Context.Provider value={context}>
          <RegisterUser />
        </Context.Provider>
      </QueryClientProvider>,
    );
  };

  it('renders the initial form', () => {
    renderComponent();
    expect(
      screen.getByRole('textbox', {
        name: /first name/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('textbox', {
        name: /last name/i,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /next/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /clear form/i }),
    ).toBeInTheDocument();
  });

  it('handles correct form filling', async () => {
    renderComponent();
    fireEvent.change(
      screen.getByRole('textbox', {
        name: /first name/i,
      }),
      { target: { value: mockUser.firstName } },
    );

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
        name: /e-mail/i,
      }),
      { target: { value: mockUser.email } },
    );

    fireEvent.change(screen.getByTestId('password').firstChild as Element, {
      target: { value: mockUser.password },
    });
    fireEvent.change(
      screen.getByTestId('confirm-password').firstChild as Element,
      { target: { value: mockUser.confirmPassword } },
    );

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/user successfully registered/i),
      ).toBeInTheDocument();
    });
  });

  it('handles click on "Clear form" button', async () => {
    renderComponent();
    fireEvent.change(
      screen.getByRole('textbox', {
        name: /first name/i,
      }),
      { target: { value: mockUser.firstName } },
    );

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /last name/i,
      }),
      { target: { value: mockUser.lastName } },
    );

    fireEvent.click(screen.getByRole('button', { name: /clear form/i }));

    expect(
      screen.getByRole('textbox', {
        name: /first name/i,
      }),
    ).toHaveValue('');

    expect(
      screen.queryByRole('textbox', {
        name: /last name/i,
      }),
    ).not.toBeInTheDocument();
  });
});
