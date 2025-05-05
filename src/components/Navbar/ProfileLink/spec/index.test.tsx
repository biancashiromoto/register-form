vi.mock('@/hooks/useAuthState', () => ({
  useAuthState: () => ({ session: mockSession, signOut: vi.fn() }),
}));

vi.mock('@/hooks/useAvatarUrl', () => ({
  default: vi.fn(),
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  Link: ({ to, children, onClick }: any) => (
    <a href={to} onClick={onClick}>
      {children}
    </a>
  ),
}));

import { useNavigate } from '@tanstack/react-router';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockSession, mockUser } from '@/tests/mocks';
import ProfileLink, { SkeletonProfileLink } from '..';
import useAvatarUrl from '@/hooks/useAvatarUrl';

describe('ProfileLink Component', () => {
  let navigateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetAllMocks();
    navigateMock = vi.fn();
    (useNavigate as any).mockReturnValue(navigateMock);
  });

  const renderProfileLink = () => {
    render(<ProfileLink />);
  };

  it('should be correctly rendered', async () => {
    (useAvatarUrl as any).mockReturnValue({
      data: mockUser.avatar,
      isLoading: false,
    });
    renderProfileLink();

    expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.avatar);
    expect(screen.getByRole('img')).toHaveAttribute(
      'alt',
      `${mockUser.firstName}'s avatar`,
    );
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/sign out/i));
    expect(navigateMock).toHaveBeenCalledWith({ to: '/profile' });
  });

  it('should render skeleton if isLoadingAvatar is true', async () => {
    (useAvatarUrl as any).mockReturnValue({
      data: null,
      isLoading: true,
    });
    renderProfileLink();
    expect(screen.getByTestId('skeleton-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-email')).toBeInTheDocument();
  });
});

describe('SkeletonProfileLink Component', () => {
  it('should be correctly rendered', async () => {
    render(<SkeletonProfileLink />);
    expect(screen.getByTestId('skeleton-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-email')).toBeInTheDocument();
  });
});
