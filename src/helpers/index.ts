import { CountryType } from '@/types';

export const isUserAdult = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  return age >= 18;
};

export const filterCountries = ({ options, state }: any) => {
  const inputValue = state.inputValue.toLowerCase();
  return options.filter(
    (option: CountryType) =>
      option.nameEng?.toLowerCase().includes(inputValue) ||
      option.code.toLowerCase().includes(inputValue),
  );
};
