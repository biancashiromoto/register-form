import { City, ICity, ICountry, IState } from 'country-state-city';
import { useEffect, useState } from 'react';
import Select from '../Select';

export type SelectCityProps = {
  setValue: any;
  errors: any;
  shouldShow: boolean;
  selectedState: IState;
  selectedCountry: ICountry;
};

const SelectCity = ({
  setValue,
  errors,
  shouldShow,
  selectedState,
  selectedCountry,
}: SelectCityProps) => {
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
