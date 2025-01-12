import { sortedCountries } from '@/helpers';
import Select from '../Select';

export type CountrySelectProps = {
  setValue: any;
  errors: any;
  shouldShow: boolean;
  register: any;
};

export default function CountrySelect({
  setValue,
  errors,
  shouldShow,
  register,
}: CountrySelectProps) {
  return (
    <Select
      register={register}
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
