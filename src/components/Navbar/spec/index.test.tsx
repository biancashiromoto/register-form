vi.mock('@/hooks/useAuthState', () => ({
  useAuthState: () => ({ session: null, signOut: vi.fn() }),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
  Link: ({ to, children, onClick }: any) => (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  ),
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from '..';

describe('Navbar Component', () => {
  const queryClient = new QueryClient();
  let navigateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetAllMocks();
    navigateMock = vi.fn();
    (useNavigate as any).mockReturnValue(navigateMock);
  });

  const renderAtPath = (path: string) => {
    (useLocation as any).mockReturnValue({ pathname: path });
    render(
      <QueryClientProvider client={queryClient}>
        <Navbar />
      </QueryClientProvider>,
    );
  };

  it('should not render "Sign up" link when on /register', () => {
    renderAtPath('/register');

    expect(screen.queryByText(/Not registered yet\?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /sign up/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Already registered\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should not render "Sign in" link and avatar when on /login', () => {
    renderAtPath('/login');

    expect(screen.getByText(/Not registered yet\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByText(/Already registered\?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /sign in/i }),
    ).not.toBeInTheDocument();
  });
});
