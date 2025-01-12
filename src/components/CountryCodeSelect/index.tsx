import { sortedCountries } from '@/helpers';
import Select, { SelectProps } from '../Select';

export default function CountryCodeSelect({
  setValue,
  errors,
  shouldShow,
  register,
}: SelectProps) {
  return (
    <Select
      register={register}
      label="Choose a country code"
      shouldShow={shouldShow}
      setValue={setValue}
      errors={errors}
      name="countryCode"
      options={sortedCountries}
      displayedValue="phonecode"
      showIso
    />
  );
}
