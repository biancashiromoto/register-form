import { countries } from '@/helpers';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CountrySelect from '..';

describe('CountrySelect', () => {
  const mockSetValue = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    render(
      <CountrySelect
        register={mockRegister}
        shouldShow={true}
        errors={{}}
        setValue={mockSetValue}
      />,
    );
  });

  it('displays options when countries are fetched', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );

    countries.forEach((country) => {
      expect(screen.getByText(country.name)).toBeInTheDocument();
    });
  });

  it('filters options based on country name', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: countries[0].name.slice(0, 5) },
    });
    expect(screen.queryByText(countries[1].name)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(countries[0].name));
    expect(mockSetValue).toHaveBeenCalledWith('country', countries[0].name);
  });
});
