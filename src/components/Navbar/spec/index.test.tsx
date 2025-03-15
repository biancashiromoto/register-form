import { useAuth } from '@/context/authContext';
import { supabase } from '@/services/supabase';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from '..';

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

describe('Navbar Component', () => {
  const mockSetUser = vi.fn();
  beforeEach(() => vi.resetAllMocks());

  const renderComponent = ({ user, location } = mockProps) => {
    const navigateMock = vi.fn();

    (useAuth as any).mockReturnValue({ user, setUser: mockSetUser });
    (useLocation as any).mockReturnValue(location);
    (useNavigate as any).mockReturnValue(navigateMock);

    render(<Navbar />);
  };

  it('should not render "Register" link when route includes /register', () => {
    renderComponent();

    expect(screen.queryByText(/Not registered yet\?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /register/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Already registered\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('should not render "Login" link when route is /login', () => {
    renderComponent({ ...mockProps, location: { pathname: '/login' } });

    expect(screen.getByText(/Not registered yet\?/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    expect(screen.queryByText(/Already registered\?/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /login/i }),
    ).not.toBeInTheDocument();
  });

  // it('renders "Home" link when user is logged in and current path is not "/home"', () => {
  //   const newProps = {
  //     user: { id: '123' },
  //     location: { pathname: '/not-found' },
  //   };
  //   renderComponent(newProps);

  //   expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  // });

  it('should not render "Home" link when route is "/home"', () => {
    const newProps = {
      user: { id: '123' },
      location: { pathname: '/home' },
    };
    renderComponent(newProps);

    expect(
      screen.queryByRole('link', { name: /home/i }),
    ).not.toBeInTheDocument();
  });

  it('renders "Logout" link when user is logged in and current path is "/home", and calls signOut on click', async () => {
    const setUserMock = vi.fn();
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      setUser: setUserMock,
    });
    (useLocation as any).mockReturnValue({ pathname: '/home' });

    render(<Navbar />);
    const logoutLink = screen.getByText(/Logout/i);
    expect(logoutLink).toBeInTheDocument();

    await fireEvent.click(logoutLink);

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(setUserMock).toHaveBeenCalledWith(null);
  });
});
