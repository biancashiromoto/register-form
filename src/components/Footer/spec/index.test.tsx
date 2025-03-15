import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '..';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders a link with the correct attributes', () => {
    const linkElement = screen.getByRole('link', { name: /GitHub repo/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute(
      'href',
      'https://github.com/biancashiromoto/register-form',
    );
  });

  it('renders the GitHub icon with proper aria-label', () => {
    const githubIcon = screen.getByLabelText('GitHub repo');
    expect(githubIcon).toBeInTheDocument();
  });

  it('renders the open icon with proper aria-label', () => {
    const openIcon = screen.getByLabelText('Opens in a new tab');
    expect(openIcon).toBeInTheDocument();
  });
});
