import { labels } from '@/helpers/labels';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import InputPassword, { InputPasswordProps } from '../index';

describe('InputPassword', () => {
  const mockRegister = vi.fn();
  const mockProps: InputPasswordProps = {
    shouldShow: true,
    errors: {},
    register: mockRegister,
    isConfirmPassword: false,
  };

  const renderComponent = (props = mockProps) => {
    render(<InputPassword {...props} />);
  };

  it('does not render when shouldShow is false', () => {
    renderComponent({ ...mockProps, shouldShow: false });
    expect(screen.queryByLabelText(labels.password)).not.toBeInTheDocument();
  });

  it('calls register function with correct argument', () => {
    renderComponent();
    expect(mockRegister).toHaveBeenCalledWith('password');
    expect(screen.getByText(labels.password)).toBeInTheDocument();
  });

  it('renders correctly if isConfirmPassword is true', () => {
    renderComponent({ ...mockProps, isConfirmPassword: true });
    expect(screen.getByText(labels.confirmPassword)).toBeInTheDocument();
  });
});
