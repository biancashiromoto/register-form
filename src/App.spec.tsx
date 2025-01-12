import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { mockCountries, mockUser } from './tests/mocks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useFetchCountries from './hooks/useFetchCountries';

vi.mock('@/hooks/useFetchCountries', () => {
  return {
    default: vi.fn(),
  };
});

const queryClient = new QueryClient();

describe('App Form', () => {
  beforeEach(() => {
    (useFetchCountries as any).mockReturnValue({
      countries: mockCountries,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: vi.fn(),
    });
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
  });

  it('renders the initial form', () => {
    expect(screen.getByText(/register form/i)).toBeInTheDocument();

    const firstNameInput = screen.getByRole('textbox', {
      name: /first name/i,
    });
    expect(firstNameInput).toBeInTheDocument();

    const lastNameInput = screen.queryByRole('textbox', {
      name: /last name/i,
    });
    expect(lastNameInput).not.toBeInTheDocument();

    const nextButton = screen.queryByRole('button', { name: /next/i });
    expect(nextButton).not.toBeInTheDocument();
  });

  it('handles correct form filling', async () => {
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

    fireEvent.click(screen.getByRole('button', { name: /open/i }));
    await screen.findByText(
      `${mockCountries[0].code} (${mockCountries[0].nameEng})`,
    );
    fireEvent.click(
      screen.getByText(
        `${mockCountries[0].code} (${mockCountries[0].nameEng})`,
      ),
    );

    fireEvent.change(screen.getByRole('textbox', { name: /phone/i }), {
      target: { value: mockUser.phone },
    });

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });
});
