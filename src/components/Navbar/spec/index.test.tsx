import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from '..';
import { ContextProps } from '@/context/index.types';
import { Context } from '@/context';

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

const mockProps: {
  user: { id: string } | null;
  location: { pathname: string };
} = {
  user: null,
  location: { pathname: '/register' },
};

const mockContext = {
  isPrivateRoute: false,
} as unknown as ContextProps;

describe('Navbar Component', () => {
  const mockSetUser = vi.fn();
  beforeEach(() => vi.resetAllMocks());

  const renderComponent = (
    { user, location } = mockProps,
    context = mockContext,
  ) => {
    const navigateMock = vi.fn();

    (useAuth as any).mockReturnValue({ user, setUser: mockSetUser });
    (useLocation as any).mockReturnValue(location);
    (useNavigate as any).mockReturnValue(navigateMock);

    render(
      <Context.Provider value={context}>
        <Navbar />
      </Context.Provider>,
    );
  };

  it('should not render "Sign up" link when route includes /register', () => {
    renderComponent();

    expect(screen.queryByText(/Not registered yet\?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /sign up/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Already registered\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should not render "Log in" link when route is /login', () => {
    renderComponent({ ...mockProps, location: { pathname: '/login' } });

    expect(screen.getByText(/Not registered yet\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByText(/Already registered\?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /sign in/i }),
    ).not.toBeInTheDocument();
  });

  it('renders "Sign out" link when user is logged in and current path is "/home", and calls signOut on click', async () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      setUser: mockSetUser,
    });
    (useLocation as any).mockReturnValue({ pathname: '/home' });

    renderComponent(undefined, {
      isPrivateRoute: true,
    } as unknown as ContextProps);
    const logoutLink = screen.getByText(/sign out/i);
    expect(logoutLink).toBeInTheDocument();

    fireEvent.click(logoutLink);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });
});
