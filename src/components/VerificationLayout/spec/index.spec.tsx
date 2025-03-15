import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/context/authContext';
import VerificationLayout from '..';
import { Session } from '@supabase/supabase-js';

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}));

const mockProps: {
  currentSession: Session | null;
  initializing: boolean;
  location: { pathname: string };
} = {
  location: { pathname: '/home' },
  currentSession: {
    access_token: 'token',
    user: {
      id: 'userId',
      email: 'user@email.com',
    },
  } as Session,
  initializing: false,
};

describe('VerificationLayout Component', () => {
  const navigateMock = vi.fn();
  beforeEach(() => vi.resetAllMocks());

  const renderComponent = (props = mockProps) => {
    (useAuth as any).mockReturnValue({
      user: props.currentSession?.user ?? null,
      currentSession: props.currentSession,
      initializing: props.initializing,
    });
    (useLocation as any).mockReturnValue(props.location);
    (useNavigate as any).mockReturnValue(navigateMock);

    render(
      <VerificationLayout>
        <div>Protected Content</div>
      </VerificationLayout>,
    );
  };

  it('should redirect to /unauthenticated if user is not authenticated and route is not public', async () => {
    renderComponent({
      ...mockProps,
      currentSession: null,
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/unauthenticated',
        replace: true,
      });
    });
  });

  it('should not redirect if user is authenticated', () => {
    renderComponent({ ...mockProps, initializing: false });

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('should not redirect if user is not authenticated but route is public', () => {
    renderComponent({
      ...mockProps,
      location: { pathname: '/login' },
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('should show loader if initializing is true', () => {
    renderComponent({
      ...mockProps,
      initializing: true,
    });

    expect(screen.getByTestId('loading-img')).toBeInTheDocument();
  });
});
