import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputText, { InputTextProps } from '../index';

describe('InputText', () => {
  const mockRegister = vi.fn();
  const mockProps: InputTextProps = {
    shouldShow: true,
    errors: {},
    name: 'testName',
    register: mockRegister,
  };

  const renderComponent = (props = mockProps) => {
    render(
      <InputText
        shouldShow={props.shouldShow}
        register={mockRegister}
        errors={props.errors}
        name="testName"
      />,
    );
  };

  it('does not render when shouldShow is false', () => {
    renderComponent({ ...mockProps, shouldShow: false });
    expect(screen.queryByLabelText('testName')).not.toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const errors = {
      testName: {
        message: 'Invalid input',
      },
    };
    renderComponent({ ...mockProps, errors });
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('calls register function with correct argument', () => {
    renderComponent();
    expect(mockRegister).toHaveBeenCalledWith('testName');
  });
});
