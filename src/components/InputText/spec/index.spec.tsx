import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputText, { InputTextProps } from '../index';
import { labels } from '@/helpers/labels';

describe('InputText', () => {
  const mockRegister = vi.fn();
  const mockProps: InputTextProps = {
    shouldShow: true,
    errors: {},
    name: 'firstName',
    register: mockRegister,
  };

  const renderComponent = (props = mockProps) => {
    render(<InputText {...props} />);
  };

  it('does not render when shouldShow is false', () => {
    renderComponent({ ...mockProps, shouldShow: false });
    expect(
      screen.queryByLabelText(labels[mockProps.name]),
    ).not.toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const errors = {
      firstName: {
        type: 'required',
        message: 'Invalid input',
      },
    };
    renderComponent({ ...mockProps, errors });
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('calls register function with correct argument', () => {
    renderComponent();
    expect(mockRegister).toHaveBeenCalledWith('firstName');
  });
});
