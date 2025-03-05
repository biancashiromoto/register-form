import { sortedCountries } from '@/helpers';
import Select from '../Select';

export type SelectCountry = {
  setValue: any;
  errors: any;
  shouldShow: boolean;
};

export default function SelectCountry({
  setValue,
  errors,
  shouldShow,
}: SelectCountry) {
  return (
    <Select
      label="Choose a country"
      shouldShow={shouldShow}
      setValue={setValue}
      errors={errors}
      name="country"
      options={sortedCountries}
      displayedValue="name"
    />
  );
}
