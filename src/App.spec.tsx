import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { Context, ContextProps } from './context';
import useFetchCountries from './hooks/useFetchCountries';
import { mockCountries } from './tests/mocks';

vi.mock('@/hooks/useFetchCountries', () => {
  return {
    default: vi.fn(),
  };
});

const queryClient = new QueryClient();

const mockFormStepsDispatch = vi.fn();

const mockContext = {
  formStepsDispatch: mockFormStepsDispatch,
  formStepsState: {
    activeStep: 0,
  },
} as unknown as ContextProps;

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
        <Context.Provider value={mockContext}>
          <App />
        </Context.Provider>
      </QueryClientProvider>,
    );
  });

  it('renders the initial form', () => {
    expect(
      screen.getByRole('heading', { name: /register form/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /step 1: user register/i }),
    ).toBeInTheDocument();
  });
});
