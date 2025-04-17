import Header from '@/components/Header';
import { Context } from '@/context';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
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

import * as authContext from '@/context/authContext';
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { ContextProps } from '@/context/index.types';
import { AuthState } from '@/hooks/useAuthState';
import useAvatarUrl from '@/hooks/useAvatarUrl';
import { mockSession } from '@/tests/mocks';
vi.mock('@/hooks/useAvatarUrl', () => ({
  default: vi.fn(),
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the toggle theme switch with the correct aria-label when dark mode is off', () => {
    (useAvatarUrl as any).mockReturnValue({
      data: 'http://example.com/avatar.png',
      isLoading: false,
    });
    renderWithProviders(<Header />, { isDarkModeOn: false });
    expect(screen.getByTestId('toggle-theme-switch')).toHaveAttribute(
      'aria-label',
      'Activate dark mode',
    );
  });

  it('should render the toggle theme switch with the correct aria-label when dark mode is on', () => {
    (useAvatarUrl as any).mockReturnValue({
      data: 'http://example.com/avatar.png',
      isLoading: false,
    });
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

  it('should not render the profile box (avatar and email) when user is not authenticated', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      sessionRef: null,
    } as AuthState);
    (useAvatarUrl as any).mockReturnValue({
      data: 'http://example.com/avatar.png',
      isLoading: false,
    });
    renderWithProviders(<Header />);
    expect(screen.queryByText(/@/i)).not.toBeInTheDocument();
  });

  it('should render the profile box with Avatar and email when user is authenticated and avatar is loaded', async () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      sessionRef: mockSession,
    } as AuthState);
    (useAvatarUrl as any).mockReturnValue({
      data: 'http://example.com/avatar.png',
      isLoading: false,
    });
    renderWithProviders(<Header />);
    expect(screen.getByText('johndoe@email.com')).toBeInTheDocument();
    const avatarImg = screen.getByRole('img') as HTMLImageElement;
    expect(avatarImg).toHaveAttribute('src', 'http://example.com/avatar.png');
  });

  it('should render Skeleton instead of Avatar when avatar is loading', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      sessionRef: mockSession,
    } as AuthState);
    (useAvatarUrl as any).mockReturnValue({ data: null, isLoading: true });
    renderWithProviders(<Header />);
    const skeleton = document.querySelector('.MuiSkeleton-root');
    expect(skeleton).toBeInTheDocument();
    expect(screen.getByText('johndoe@email.com')).toBeInTheDocument();
  });

  it('should navigate to /profile when the profile box is clicked', () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({
      sessionRef: mockSession,
    } as AuthState);
    (useAvatarUrl as any).mockReturnValue({
      data: 'http://example.com/avatar.png',
      isLoading: false,
    });
    renderWithProviders(<Header />);
    const profileBox = screen.getByText('johndoe@email.com').parentElement;
    expect(profileBox).toBeDefined();
    fireEvent.click(profileBox!);
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/profile' });
  });
});
