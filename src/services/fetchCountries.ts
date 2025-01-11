export const fetchCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all');
  const data = await response.json();

  return data.map((country: any) => {
    const root = country.idd?.root || '';
    const suffix = country.idd?.suffixes?.[0] || '';

    const countryPhoneCode =
      root === '+1'
        ? `${root}${suffix ? `(${suffix})` : ''}`
        : `${root}${suffix || ''}`;

    return {
      code: countryPhoneCode || 'N/A',
      name: country.name?.common || 'Unknown',
      flag: country.flags?.svg || '',
      iso: country.altSpellings || [],
    };
  });
};
