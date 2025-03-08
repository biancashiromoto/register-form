import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/context/authContext';
import VerificationLayout from '..';

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
  user: { id: string } | null;
  location: { pathname: string };
} = {
  user: null,
  location: { pathname: '/home' },
};

describe('VerificationLayout Component', () => {
  const navigateMock = vi.fn();
  beforeEach(() => vi.resetAllMocks());

  const renderComponent = ({ user, location } = mockProps) => {
    (useAuth as any).mockReturnValue({ user });
    (useLocation as any).mockReturnValue(location);
    (useNavigate as any).mockReturnValue(navigateMock);

    render(
      <VerificationLayout>
        <div>Protected Content</div>
      </VerificationLayout>,
    );
  };

  it('should redirect to /unauthenticated if user is not authenticated and route is not public', async () => {
    renderComponent();

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/unauthenticated',
        replace: true,
      });
    });
  });

  it('should not redirect if user is authenticated', () => {
    renderComponent({ ...mockProps, user: { id: '1' } });

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('should not redirect if user is not authenticated but route is public', () => {
    renderComponent({ ...mockProps, location: { pathname: '/login' } });

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
