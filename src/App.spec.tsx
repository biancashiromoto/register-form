import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('@/context/authContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/components/VerificationLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/Navbar', () => ({
  default: ({ children }: { children: ReactNode }) => (
    <nav data-testid="navbar">{children}</nav>
  ),
}));

vi.mock('@/components/Footer', () => ({
  default: ({ children }: { children: ReactNode }) => (
    <footer data-testid="footer">{children}</footer>
  ),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    render(<App />);
  });

  it('renders the Navbar', () => {
    const navbar = screen.getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
  });

  it('renders the Footer', () => {
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
});
