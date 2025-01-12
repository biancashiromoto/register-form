import useFetchCountries from '@/hooks/useFetchCountries';
import { mockCountries } from '@/tests/mocks';
import { CountryType } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CountrySelect from '..';

vi.mock('@/hooks/useFetchCountries');

describe('CountrySelect', () => {
  const mockSetValue = vi.fn();
  const mockRegister = vi.fn();

  const renderComponent = (countries: CountryType[] = mockCountries) => {
    (useFetchCountries as any).mockReturnValue({
      countries: countries,
    });
    render(
      <CountrySelect
        register={mockRegister}
        shouldShow={true}
        errors={{}}
        setValue={mockSetValue}
      />,
    );
  };

  it('displays options when countries are fetched', () => {
    renderComponent();
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );

    mockCountries.forEach((country, index) => {
      expect(screen.getByText(country.nameEng)).toBeInTheDocument();
      expect(screen.getAllByRole('img')[index]).toHaveAttribute(
        'src',
        country.flag.src,
      );
      expect(screen.getAllByRole('img')[index]).toHaveAttribute(
        'alt',
        country.flag.altText,
      );
    });
  });

  it('calls setValue with the correct country code when an option is selected', () => {
    renderComponent();
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.click(screen.getByText(mockCountries[0].nameEng));
    expect(mockSetValue).toHaveBeenCalledWith(
      'country',
      mockCountries[0].nameEng,
    );
  });

  it('filters options based on country name', () => {
    renderComponent();
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: mockCountries[0].nameEng.slice(0, 3) },
    });
    expect(
      screen.queryByText(mockCountries[1].nameEng),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(mockCountries[0].nameEng));
    expect(mockSetValue).toHaveBeenCalledWith(
      'country',
      mockCountries[0].nameEng,
    );
  });
});
