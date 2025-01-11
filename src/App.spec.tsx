import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import App from './App';

it('renders App', () => {
  render(<App />);
  expect(screen.getByText(/register form/i)).toBeInTheDocument();
});
