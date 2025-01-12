import CountryCodeSelect from '@/components/CountryCodeSelect';
import useFetchCountries from '@/hooks/useFetchCountries';
import { mockCountries } from '@/tests/mocks';
import { CountryType } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useFetchCountries');

describe('CountrySelect', () => {
  const mockSetValue = vi.fn();

  const renderComponent = (countries: CountryType[] = mockCountries) => {
    (useFetchCountries as any).mockReturnValue({
      countries: countries,
    });
    render(<CountryCodeSelect errors={{}} setValue={mockSetValue} />);
  };

  it('displays options when countries are fetched', () => {
    renderComponent();
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );

    mockCountries.forEach((country) =>
      expect(
        screen.getByText(`${country.code} (${country.nameEng})`),
      ).toBeInTheDocument(),
    );
  });

  it('calls setValue with the correct country code when an option is selected', () => {
    renderComponent();
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.click(
      screen.getByText(
        `${mockCountries[0].code} (${mockCountries[0].nameEng})`,
      ),
    );
    expect(mockSetValue).toHaveBeenCalledWith(
      'countryCode',
      mockCountries[0].code,
    );
  });

  it('filters options based on country code', () => {
    renderComponent();
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: mockCountries[0].code },
    });
    expect(
      screen.queryByText(
        `${mockCountries[1].code} (${mockCountries[1].nameEng})`,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCountries[0].code} (${mockCountries[0].nameEng})`,
      ),
    ).toBeInTheDocument();
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
      screen.queryByText(
        `${mockCountries[1].code} (${mockCountries[1].nameEng})`,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        `${mockCountries[0].code} (${mockCountries[0].nameEng})`,
      ),
    ).toBeInTheDocument();
  });

  it('calls setValue with empty code if none is provided', () => {
    const incompleteCountryObj: CountryType = {
      code: '',
      flag: {
        altText: '',
        src: 'japan.svg',
      },
      iso: 'JP',
      nameEng: 'Japan',
    };

    renderComponent([...mockCountries, incompleteCountryObj]);
    fireEvent.click(
      screen.getByRole('button', {
        name: /open/i,
      }),
    );
    expect(screen.getAllByRole('img')[mockCountries.length]).toHaveAttribute(
      'alt',
      `${incompleteCountryObj.nameEng} flag`,
    );
    fireEvent.click(screen.getByText(`(${incompleteCountryObj.nameEng})`));
    expect(mockSetValue).toHaveBeenCalledWith('countryCode', '');
  });
});
