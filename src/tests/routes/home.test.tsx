import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RouteComponent } from '@/routes/home';
import * as authContext from '@/context/authContext';
import { mockSession } from '../mocks';
import { AuthState } from '@/hooks/useAuthState';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('/home route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render success message if sessionRef is not null', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      sessionRef: mockSession,
    } as AuthState);

    render(<RouteComponent />);

    expect(
      screen.getByText('You have successfully logged in!'),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should call navigate to "/unauthenticated" if sessionRef for null', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      sessionRef: null,
    } as AuthState);

    render(<RouteComponent />);

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/unauthenticated' });
  });
});
