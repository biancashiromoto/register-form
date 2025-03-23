import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import InputPassword, { InputPasswordProps } from '../index';

const mockRegister = vi.fn();
const mockProps: InputPasswordProps = {
  hidden: false,
  errors: {},
  register: mockRegister,
  isConfirmPassword: false,
  isExistingPassword: false,
};

describe('InputPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props: InputPasswordProps = mockProps) => {
    return render(<InputPassword {...props} />);
  };

  it('does not render when hidden is false', () => {
    renderComponent({ ...mockProps, hidden: true });
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it('calls register function with correct argument when isConfirmPassword is false', () => {
    renderComponent();
    expect(mockRegister).toHaveBeenCalledWith('password');
    expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
  });

  it('calls register function with correct argument when isConfirmPassword is true', () => {
    renderComponent({ ...mockProps, isConfirmPassword: true });
    expect(mockRegister).toHaveBeenCalledWith('confirmPassword');
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('displays error message when errors are provided', () => {
    const errorMessage = 'This field is required';
    const errors = { password: { message: errorMessage, type: 'required' } };
    renderComponent({ ...mockProps, errors });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('toggles password visibility when icon button is clicked', () => {
    renderComponent();
    const input = screen.getByTestId('password').firstChild as HTMLInputElement;
    if (input) {
      fireEvent.change(input, {
        target: { value: 'secretpassword@123' },
      });
    }
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveValue('secretpassword@123');
    expect(screen.queryByText('secretpassword@123')).not.toBeInTheDocument();

    const iconButton = screen.getByRole('button', {
      name: /display the password/i,
    });

    fireEvent.click(iconButton);
    expect(input).toHaveAttribute('type', 'text');

    expect(iconButton).toHaveAttribute('aria-label', 'hide the password');
    fireEvent.click(iconButton);
    expect(iconButton).toHaveAttribute('aria-label', 'display the password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles mouse down and mouse up events without errors', () => {
    renderComponent();
    const iconButton = screen.getByRole('button', {
      name: /display the password/i,
    });
    fireEvent.mouseDown(iconButton);
    fireEvent.mouseUp(iconButton);
  });
});
