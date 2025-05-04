import { AuthProvider } from '@/context/authContext';
import { RouteComponent } from '@/routes/_authenticated/home';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockAuthState = {
  session: null,
  signIn: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
};
vi.mock('@/hooks/useAuthState', () => ({
  useAuthState: () => mockAuthState,
}));

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

  const renderHomeRoute = () => {
    return render(
      <AuthProvider>
        <RouteComponent />
      </AuthProvider>,
    );
  };

  it('should render home page', () => {
    renderHomeRoute();
    expect(
      screen.getByText(/you have successfully logged in/i),
    ).toBeInTheDocument();
  });
});
