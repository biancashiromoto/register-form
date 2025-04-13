import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomBottomNavigation from '@/components/BottomNavigation';
import { Context } from '@/context';

const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}));

describe('CustomBottomNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call navigate with /home after click on "Home"', () => {
    const contextValue = {
      normalizedPath: '/profile',
    };

    render(
      <Context.Provider value={contextValue as any}>
        <CustomBottomNavigation />
      </Context.Provider>,
    );

    const homeAction = screen.getByText('Home');
    expect(homeAction).toBeInTheDocument();

    fireEvent.click(homeAction);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/home',
      viewTransition: true,
    });
  });

  it('should call navigate with /profile after click on "Profile"', () => {
    const contextValue = {
      normalizedPath: '/home',
    };

    render(
      <Context.Provider value={contextValue as any}>
        <CustomBottomNavigation />
      </Context.Provider>,
    );

    const profileAction = screen.getByText('Profile');
    expect(profileAction).toBeInTheDocument();

    fireEvent.click(profileAction);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/profile',
      viewTransition: true,
    });
  });
});
