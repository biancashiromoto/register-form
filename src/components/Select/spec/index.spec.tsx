import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select, { SelectProps } from '..';

vi.mock('@/helpers', () => ({
  filterOptions: vi.fn((options) => options),
}));

const options = [
  { name: 'Brazil', isoCode: 'BR' },
  { name: 'Argentina', isoCode: 'AR' },
];

describe('Select Component', () => {
  const setValue = vi.fn();
  const filterOptions = vi.fn();
  const mockProps: SelectProps = {
    displayedValue: 'name',
    errors: '',
    name: 'country',
    options,
    setValue,
    shouldShow: true,
    filterOptions,
    showIso: true,
    label: 'Select a country',
  };

  const renderComponent = (props = mockProps) => {
    render(<Select {...props} />);
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
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
  });

  it('should call setValue with the correct value after selecting an option', async () => {
    renderComponent();
    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    const optionBrazil = await screen.findByText('Brazil (BR)');
    expect(optionBrazil).toBeInTheDocument();
    await userEvent.click(optionBrazil);

    expect(setValue).toHaveBeenCalledWith('country', options[0]);
  });

  it('should display error message if errors is defined', () => {
    const errors = { country: true, message: 'Country is required' };
    renderComponent({ ...mockProps, errors });
    expect(screen.getByText('Country is required')).toBeInTheDocument();
  });
});
