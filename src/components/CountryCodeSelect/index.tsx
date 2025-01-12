import { sortedCountries } from '@/helpers';
import Select from '../Select';

export type CountryCodeSelectProps = {
  setValue: any;
  errors: any;
  shouldShow: boolean;
  register: any;
};

export default function CountryCodeSelect({
  setValue,
  errors,
  shouldShow,
  register,
}: CountryCodeSelectProps) {
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
    />
  );
}
