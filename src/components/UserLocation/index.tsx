import { Context } from '@/context';
import { UserType } from '@/types';
import { Box } from '@mui/material';
import { City, Country, ICity, ICountry, IState, State } from 'country-state-city';
import { useContext, useState } from 'react';
import { FieldErrors, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import CustomAutocomplete from '../Autocomplete';

interface UserLocationProps {
  errors: FieldErrors<UserType>;
  getValues: UseFormGetValues<UserType>;
  setValue: UseFormSetValue<UserType>;
}

const UserLocation = ({ errors, getValues, setValue }: UserLocationProps) => {
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);
  const { setSelectedLocation } = useContext(Context);

  const handleCountryChange = (country: ICountry | null) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setValue('address.state', '');
    setValue('address.city', '');
    if (country) {
      setSelectedLocation((prev) => ({ ...prev, country }));
    }
  };

  const handleStateChange = (state: IState | null) => {
    setSelectedState(state);
    setSelectedCity(null);
    setValue('address.city', '');
    if (state) {
      setSelectedLocation((prev) => ({ ...prev, state }));
    }
  };

  const handleCityChange = (city: ICity | null) => {
    setSelectedCity(city);
    if (city) {
      setSelectedLocation((prev) => ({ ...prev, city }));
    }
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={2}>
      <CustomAutocomplete
        errors={errors}
        field="address.country"
        getValues={getValues}
        label="Country"
        options={Country.getAllCountries()}
        previousField="email"
        setValue={setValue}
        setterCallback={handleCountryChange}
      />

      <CustomAutocomplete
        errors={errors}
        field="address.state"
        getValues={getValues}
        label="State"
        options={State.getStatesOfCountry(selectedCountry?.isoCode || '')}
        previousField="address.country"
        setValue={setValue}
        setterCallback={handleStateChange}
      />

      <CustomAutocomplete
        errors={errors}
        field="address.city"
        getValues={getValues}
        label="City"
        options={City.getCitiesOfState(
          selectedCountry?.isoCode || '',
          selectedState?.isoCode || '',
        )}
        previousField="address.state"
        setValue={setValue}
        setterCallback={handleCityChange}
      />
    </Box>
  );
};

export default UserLocation;