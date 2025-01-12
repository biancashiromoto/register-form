import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useFetchCountries from '@/hooks/useFetchCountries';
import { mockCountries, mockUser } from '@/tests/mocks';
import RegisterUser from '..';
import { Context, ContextProps } from '@/context';

vi.mock('@/hooks/useFetchCountries', () => {
  return {
    default: vi.fn(),
  };
});

const mockFormStepsDispatch = vi.fn();

const mockContext = {
  formStepsDispatch: mockFormStepsDispatch,
  formStepsState: {
    activeStep: 0,
  },
} as unknown as ContextProps;

const queryClient = new QueryClient();

describe('RegisterUser component', () => {
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
        <Context.Provider value={mockContext}>
          <RegisterUser />
        </Context.Provider>
      </QueryClientProvider>,
    );
  });

  it('renders the initial form', () => {
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

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(mockFormStepsDispatch).toHaveBeenCalledWith({ type: 'NEXT_STEP' });
  });
});
