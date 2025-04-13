import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { Route } from '@/routes/__root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockSession } from '../mocks';
import { createTheme } from '@mui/material';
import { Context } from '@/context';
import { ContextProps } from '@/context/index.types';

const queryClient = new QueryClient();
const testTheme = createTheme();

vi.mock('@/components/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock('@/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock('@/components/BottomNavigation', () => ({
  default: () => <div data-testid="bottom-navigation">BottomNavigation</div>,
}));

vi.mock('@/components/VerificationLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="verification-layout">{children}</div>
  ),
}));

vi.mock('@/hooks/usePageTitle', () => ({
  default: () => ({ page: { title: 'Test Page Title' } }),
}));

vi.mock('@/context/authContext', () => ({
  useAuth: () => ({ sessionRef: mockSession }),
}));

vi.mock('@/context/Provider', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <Context.Provider
      value={
        {
          theme: testTheme,
          isPrivateRoute: true,
          normalizedPath: '/home',
        } as unknown as ContextProps
      }
    >
      {children}
    </Context.Provider>
  ),
}));

describe('RootLayout (__root.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render root router with Header, Footer, BottomNavigation e o page title', async () => {
    const router = createRouter({
      routeTree: Route,
      context: {},
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('verification-layout')).toBeInTheDocument();

    expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Page Title')).toBeInTheDocument();
    });
  });
});
