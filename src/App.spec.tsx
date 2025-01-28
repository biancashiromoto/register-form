import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App Form', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('renders the initial form', () => {
    expect(
      screen.getByRole('heading', { name: /register form/i }),
    ).toBeInTheDocument();
  });
});
