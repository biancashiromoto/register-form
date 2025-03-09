// CustomAutocomplete.test.tsx
import { UserType } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { vi } from 'vitest';
import CustomAutocomplete, { CustomAutocompleteProps } from '../index';

type Option = {
  name: string;
  isoCode: string;
};

const options: Option[] = [
  { name: 'Brazil', isoCode: 'BR' },
  { name: 'Japan', isoCode: 'JP' },
];

describe('CustomAutocomplete', () => {
  const mockGetValues: UseFormGetValues<UserType> = vi.fn();
  const mockSetValue: UseFormSetValue<UserType> = vi.fn();
  const mockSetterCallback = vi.fn();

  const mockErrors: FieldErrors<UserType> = {};

  const defaultProps: CustomAutocompleteProps<Option> = {
    getValues: mockGetValues,
    errors: mockErrors,
    options: options,
    setValue: mockSetValue,
    setterCallback: mockSetterCallback,
    field: 'address.country',
    previousField: 'email',
    label: 'Country',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (
    props = defaultProps,
    returnedValue: string = 'test',
  ) => {
    (mockGetValues as any).mockReturnValue(returnedValue);
    render(<CustomAutocomplete {...props} />);
  };

  it('renders the Autocomplete with label', () => {
    renderComponent();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('calls setterCallback and setValue when an option is selected', async () => {
    renderComponent();
    const input = screen.getByRole('combobox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Bra' } });

    const option = await screen.findByText('Brazil');
    fireEvent.click(option);

    expect(mockSetterCallback).toHaveBeenCalledWith({
      name: 'Brazil',
      isoCode: 'BR',
    });
    expect(mockSetValue).toHaveBeenCalledWith('address.country', 'Brazil');
  });

  it('hides the autocomplete when getValues(previousField) is falsy and there are no errors', () => {
    renderComponent(undefined, '');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
