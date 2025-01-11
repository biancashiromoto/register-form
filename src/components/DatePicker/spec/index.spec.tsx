import DatePicker, { DatePickerProps } from '@/components/DatePicker';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('DatePicker', () => {
  const mockRegister = vi.fn();
  const mockProps = {
    shouldShow: true,
    register: mockRegister,
    errors: {},
  };

  const renderComponent = (props: DatePickerProps = mockProps) => {
    render(
      <DatePicker
        register={props.register}
        errors={props.errors}
        shouldShow={props.shouldShow}
      />,
    );
  };

  it('does not render when shouldShow is false', () => {
    renderComponent({ ...mockProps, shouldShow: false });
    expect(screen.queryByLabelText('Birth Date')).not.toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    const errors = {
      birthDate: {
        message: 'Invalid date',
      },
    };
    renderComponent({ ...mockProps, errors });

    expect(screen.getByText('Invalid date')).toBeInTheDocument();
  });

  it('calls register function with correct argument', () => {
    renderComponent();
    expect(mockRegister).toHaveBeenCalledWith('birthDate');
  });
});
