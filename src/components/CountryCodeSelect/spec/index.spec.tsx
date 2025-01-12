import CountryCodeSelect from '@/components/CountryCodeSelect';
import { countries } from '@/helpers';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('CountryCodeSelect', () => {
  const mockSetValue = vi.fn();

  beforeEach(() => {
    render(<CountryCodeSelect errors={{}} setValue={mockSetValue} />);
  });

  it('displays options when countries are fetched', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );

    countries.forEach((country) =>
      expect(
        screen.getByText(`${country.phonecode} (${country.isoCode})`),
      ).toBeInTheDocument(),
    );
  });

  it('calls setValue with the correct country code when an option is selected', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.click(
      screen.getByText(`${countries[0].phonecode} (${countries[0].isoCode})`),
    );
    expect(mockSetValue).toHaveBeenCalledWith(
      'countryCode',
      countries[0].phonecode,
    );
  });

  it('filters options based on country code', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: countries[0].phonecode },
    });
    expect(
      screen.queryByText(`${countries[1].phonecode} (${countries[1].isoCode})`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(`${countries[0].phonecode} (${countries[0].isoCode})`),
    ).toBeInTheDocument();
  });

  it('filters options based on country name', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: countries[0].isoCode[0] },
    });
    expect(
      screen.getByText(`${countries[0].phonecode} (${countries[0].isoCode})`),
    ).toBeInTheDocument();
  });
});
