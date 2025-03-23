import DatePicker, { DatePickerProps } from '@/components/DatePicker';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('DatePicker', () => {
  const mockRegister = vi.fn();
  const mockProps = {
    hidden: false,
    register: mockRegister,
    errors: {},
  };

  const renderComponent = (props: DatePickerProps = mockProps) => {
    render(
      <DatePicker
        register={props.register}
        errors={props.errors}
        hidden={props.hidden}
      />,
    );
  };

  it('does not render when hidden is false', () => {
    renderComponent({ ...mockProps, hidden: true });
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
