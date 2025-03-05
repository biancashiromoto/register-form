import { mockCountries, mockStates } from '@/tests/mocks';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ICountry } from 'country-state-city';
import { describe, expect, it, vi } from 'vitest';
import SelectState, { SelectStateProps } from '..';

describe('SelectState Component', () => {
  const setValue = vi.fn();

  const mockProps: SelectStateProps = {
    errors: '',
    setValue,
    shouldShow: true,
    selectedCountry: mockCountries[0] as ICountry,
  };

  const renderComponent = (props = mockProps) => {
    render(<SelectState {...props} />);
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
    expect(input).toHaveAttribute('id', 'state');

    expect(screen.getByLabelText('Choose a state')).toBeInTheDocument();
  });

  it('should call setValue with the correct value after selecting an option', async () => {
    renderComponent();

    const input = screen.getByRole('combobox');
    await userEvent.click(input);

    const state = await screen.findByText(mockStates[0].name);
    expect(state).toBeInTheDocument();

    await userEvent.click(state);

    expect(setValue).toHaveBeenCalledWith('state', mockStates[0]);
  });
});
