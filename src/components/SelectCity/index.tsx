import { City, ICity, ICountry, IState } from 'country-state-city';
import { useEffect, useState } from 'react';
import Select from '../Select';

export type SelectStateProps = {
  setValue: any;
  errors: any;
  shouldShow: boolean;
  register: any;
  selectedState: IState;
  selectedCountry: ICountry;
};

const SelectCity = ({
  setValue,
  errors,
  shouldShow,
  register,
  selectedState,
  selectedCountry,
}: SelectStateProps) => {
  const [cities, setCities] = useState([] as ICity[]);

  useEffect(() => {
    const filteredCities = City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode,
    );
    setCities(filteredCities);
  }, [selectedState]);

  return (
    <Select
      register={register}
      label="Choose a city"
      shouldShow={shouldShow}
      setValue={setValue}
      errors={errors}
      name="city"
      options={cities}
      displayedValue="name"
    />
  );
};

export default SelectCity;
