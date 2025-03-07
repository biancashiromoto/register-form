import { mockCities, mockCountries, mockStates } from '@/tests/mocks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ICountry, IState, State } from 'country-state-city';
import { describe, expect, it, vi } from 'vitest';
import SelectCity, { SelectCityProps } from '..';

describe('SelectState Component', () => {
  const setValue = vi.fn();

  const mockProps: SelectCityProps = {
    errors: '',
    setValue,
    shouldShow: true,
    selectedCountry: mockCountries[0].isoCode as ICountry['isoCode'],
    selectedState: mockStates[0].isoCode as IState['isoCode'],
  };

  const renderComponent = (props = mockProps) => {
    render(<SelectCity {...props} />);
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
    expect(input).toHaveAttribute('id', 'city');

    expect(screen.getByLabelText('Choose a city')).toBeInTheDocument();
  });

  it('should call setValue with the correct value after selecting an option', async () => {
    renderComponent();

    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    const state = await screen.findByText(mockCities[0].name);
    expect(state).toBeInTheDocument();

    await userEvent.click(state);

    expect(setValue).toHaveBeenCalledWith('city', mockCities[0]);
  });
});
