import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('App Form', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );
  });

  it('renders the initial form', () => {
    expect(
      screen.getByRole('heading', { name: /register form/i }),
    ).toBeInTheDocument();
  });
});
