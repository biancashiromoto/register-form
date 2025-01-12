import { countries } from '@/helpers';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SelectState from '..';
import { mockStates } from '@/tests/mocks';

describe('CountrySelect', () => {
  const mockSetValue = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    render(
      <SelectState
        register={mockRegister}
        shouldShow={true}
        errors={{}}
        setValue={mockSetValue}
        selectedCountry={countries[0]}
      />,
    );
  });

  it('displays options when states are fetched', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );

    mockStates.forEach((state) => {
      expect(screen.getByText(state.name)).toBeInTheDocument();
    });
  });

  it('filters options based on state name', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: mockStates[0].name.slice(0, 5) },
    });
    expect(screen.queryByText(mockStates[1].name)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(mockStates[0].name));
    expect(mockSetValue).toHaveBeenCalledWith('state', mockStates[0]);
  });
});
