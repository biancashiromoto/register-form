import { RouteComponent } from '@/routes/unauthenticated';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('/unauthenticated route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<RouteComponent />);
    expect(
      screen.getByRole('heading', {
        name: /oops, you are not authenticated!/i,
      }),
    );
    expect(
      screen.getByText(
        /it seems you are not logged in. To acces this page, please login or register/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toHaveAttribute('href', '/login');
    expect(loginLink).toHaveTextContent(/login/i);
    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toHaveAttribute('href', '/register');
    expect(registerLink).toHaveTextContent(/register/i);
  });
});
