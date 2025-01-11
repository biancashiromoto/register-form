import { CountryType } from '@/types';

export const fetchCountries = async (): Promise<CountryType[]> => {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();

  return data.map((country: any) => {
    const root = country.idd?.root || '';
    const suffix = country.idd?.suffixes?.[0] || '';

    return {
      code: root + suffix || 'N/A',
      nameEng: country.name?.common || 'Unknown',
      namePt: country.translations.por || 'Unknown',
      flag: {
        src: country.flags?.svg || '',
        alt: country.flags?.alt || `${country.name} flag`,
      },
      iso: country.altSpellings || [],
    };
  });
};
