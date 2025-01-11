import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputPhone, { InputPhoneProps } from '..';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../CountrySelect', () => ({
  __esModule: true,
  default: vi.fn(() => <div>CountrySelect</div>),
}));

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <InputPhone
          register={props.register}
          setValue={props.setValue}
          errors={props.errors}
          shouldShow={shouldShow}
        />
      </QueryClientProvider>,
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
