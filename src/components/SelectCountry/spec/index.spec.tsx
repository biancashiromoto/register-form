import { SelectProps } from '@/components/Select';
import { mockCountries } from '@/tests/mocks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SelectCountry from '..';

describe('SelectCountry Component', () => {
  const setValue = vi.fn();
  const filterOptions = vi.fn();
  const mockProps: SelectProps = {
    displayedValue: 'name',
    errors: '',
    name: 'country',
    options: mockCountries,
    setValue,
    shouldShow: true,
    filterOptions,
    showIso: true,
    label: 'Select a country',
  };

  const renderComponent = (props = mockProps) => {
    render(<SelectCountry {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not be rendered if shouldShow is false', () => {
    renderComponent({ ...mockProps, shouldShow: false });
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('should be rendered if shouldShow is true', () => {
    renderComponent();

    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'country');

    expect(screen.getByLabelText('Choose a country')).toBeInTheDocument();
  });

  it('should call setValue with the correct value after selecting an option', async () => {
    renderComponent();

    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    const option = await screen.findByText(mockCountries[0].name);
    await userEvent.click(option);

    expect(setValue).toHaveBeenCalledWith('country', mockCountries[0]);
  });
});
