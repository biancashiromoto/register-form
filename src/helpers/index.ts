import { Country, ICountry } from 'country-state-city';

export const countries = Country.getAllCountries();

export const sortedCountries = [...countries].sort((a, b) =>
  a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
);

export const isUserAdult = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  return age >= 18;
};

export const filterCountries = ({ options, state }: any) => {
  const inputValue = state.inputValue.toLowerCase();
  return options.filter(
    (option: ICountry) =>
      option.name.toLowerCase().includes(inputValue) ||
      option.phonecode.toLowerCase().includes(inputValue),
  );
};
