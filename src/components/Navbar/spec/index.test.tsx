import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from '..';
import { ContextProps } from '@/context/index.types';
import { Context } from '@/context';
import { Session } from '@supabase/supabase-js';

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
  Link: ({
    children,
    to,
    onClick,
  }: {
    children: React.ReactNode;
    to: string;
    activeProps?: any;
    onClick?: any;
  }) => (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  ),
}));

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe('Navbar Component', () => {
  const mockSetUser = vi.fn();
  beforeEach(() => vi.resetAllMocks());

  const renderComponent = (
    location: Location,
    currentSession: Session | undefined = undefined,
    isPrivateRoute: boolean = false,
  ) => {
    const navigateMock = vi.fn();

    (useAuth as any).mockReturnValue({ setUser: mockSetUser, currentSession });
    (useLocation as any).mockReturnValue(location);
    (useNavigate as any).mockReturnValue(navigateMock);

    render(
      <Context.Provider value={{ isPrivateRoute } as ContextProps}>
        <Navbar />
      </Context.Provider>,
    );
  };

  it('should not render "Sign up" link when route includes /register', () => {
    renderComponent({ pathname: '/register' } as Location);

    expect(screen.queryByText(/Not registered yet\?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /sign up/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Already registered\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should not render "Log in" link when route is /login', () => {
    renderComponent({ pathname: '/login' } as Location);

    expect(screen.getByText(/Not registered yet\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByText(/Already registered\?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /sign in/i }),
    ).not.toBeInTheDocument();
  });

  it('renders "Sign out" link when user is logged in and current path is "/home", and calls signOut on click', async () => {
    renderComponent(
      { pathname: '/home' } as Location,
      {
        access_token: '',
        refresh_token: '',
        expires_in: 3600,
        token_type: 'bearer',
        user: { email: 'test@email.com' },
      } as Session,
      true,
    );

    const logoutLink = await screen.findByRole('link', { name: /sign out/i });
    expect(logoutLink).toBeInTheDocument();

    fireEvent.click(logoutLink);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });
});
