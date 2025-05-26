import Header from '@/components/Header';
import { Context } from '@/context';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const theme = createTheme();

const renderWithProviders = (
  ui: React.ReactElement,
  contextValue: Partial<{
    toggleTheme: () => void;
    isDarkModeOn: boolean;
    normalizedPath: string;
    snackbarState: any;
  }> = {},
) => {
  return render(
    <ThemeProvider theme={theme}>
      <Context.Provider
        value={
          {
            toggleTheme: () => {},
            isDarkModeOn: false,
            normalizedPath: '',
            snackbarState: null,
            ...contextValue,
          } as unknown as ContextProps
        }
      >
        {ui}
      </Context.Provider>
    </ThemeProvider>,
  );
};

vi.mock('@/components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock('@/components/ToggleThemeSwitch', () => ({
  default: (props: any) => (
    <input
      data-testid="toggle-theme-switch"
      aria-label={props['aria-label']}
      onChange={props.onChange}
      checked={props.checked}
    />
  ),
}));

const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { ContextProps } from '@/context/index.types';

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the toggle theme switch with the correct aria-label when dark mode is off', () => {
    renderWithProviders(<Header />, { isDarkModeOn: false });
    expect(screen.getByTestId('toggle-theme-switch')).toHaveAttribute(
      'aria-label',
      'Activate dark mode',
    );
  });

  it('should render the toggle theme switch with the correct aria-label when dark mode is on', () => {
    renderWithProviders(<Header />, { isDarkModeOn: true });
    expect(screen.getByTestId('toggle-theme-switch')).toHaveAttribute(
      'aria-label',
      'Deactivate dark mode',
    );
  });

  it('should render Navbar', () => {
    renderWithProviders(<Header />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});
