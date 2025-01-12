import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { Context, ContextProps } from './context';

const mockFormStepsDispatch = vi.fn();

const mockContext = {
  formStepsDispatch: mockFormStepsDispatch,
  formStepsState: {
    activeStep: 0,
  },
} as unknown as ContextProps;

describe('App Form', () => {
  beforeEach(() => {
    render(
      <Context.Provider value={mockContext}>
        <App />
      </Context.Provider>,
    );
  });

  it('renders the initial form', () => {
    expect(
      screen.getByRole('heading', { name: /register form/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /step 1: user register/i }),
    ).toBeInTheDocument();
  });
});
