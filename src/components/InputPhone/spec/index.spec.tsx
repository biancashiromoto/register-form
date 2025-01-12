import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputPhone, { InputPhoneProps } from '..';

vi.mock('../CountrySelect', () => ({
  __esModule: true,
  default: vi.fn(() => <div>CountrySelect</div>),
}));

describe('InputPhone', () => {
  const mockRegister = vi.fn();
  const mockSetValue = vi.fn();
  const mockProps = {
    errors: {},
    register: mockRegister,
    setValue: mockSetValue,
  };

  const renderComponent = (
    props: InputPhoneProps = mockProps,
    shouldShow: boolean = true,
  ) => {
    render(
      <InputPhone
        register={props.register}
        setValue={props.setValue}
        errors={props.errors}
        shouldShow={shouldShow}
      />,
    );
  };

  it('does not render when shouldShow is false', () => {
    renderComponent(mockProps, false);
    expect(screen.queryByLabelText('Phone')).not.toBeInTheDocument();
    expect(screen.queryByText('CountrySelect')).not.toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    renderComponent({
      ...mockProps,
      errors: {
        phone: {
          message: 'Invalid phone number',
          type: 'required',
        },
      },
    });
    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
  });

  it('calls register function with correct argument', () => {
    renderComponent();
    expect(mockRegister).toHaveBeenCalledWith('phone');
  });
});
