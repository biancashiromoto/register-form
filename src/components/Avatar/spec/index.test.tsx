import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Context } from '@/context';
import { useAuthState } from '@/hooks/useAuthState';
import Avatar from '..';
import { ContextProps } from '@/context/index.types';
import { mockSession } from '@/tests/mocks';

vi.mock('@/hooks/useAuthState', () => ({
  useAuthState: vi.fn(),
}));

describe('Avatar Component', () => {
  const mockContextValue = {
    avatarPath: 'mock-avatar-path',
    isLoadingAvatar: false,
    isPendingAvatar: false,
  };

  const renderWithContext = (contextValue = mockContextValue) =>
    render(
      <Context.Provider value={contextValue as unknown as ContextProps}>
        <Avatar />
      </Context.Provider>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthState as any).mockReturnValue({ session: mockSession });
  });

  test('renders a loading skeleton when avatar is loading', () => {
    renderWithContext({ ...mockContextValue, isLoadingAvatar: true });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  test('renders a fallback avatar when no avatarPath is provided', () => {
    renderWithContext({ ...mockContextValue, avatarPath: null });

    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
  });

  test('renders the avatar with the correct src when avatarPath is provided', () => {
    renderWithContext();

    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'mock-avatar-path');
  });
});
