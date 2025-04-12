import { Context } from '@/context';
import { UserLocationType, UserType } from '@/types';
import { Box } from '@mui/material';
import {
  City,
  Country,
  ICity,
  ICountry,
  IState,
  State,
} from 'country-state-city';
import { useContext, useMemo, useState } from 'react';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
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
  const { setUserLocation } = useContext(Context);

  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode);
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode,
    );
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (country: ICountry | null) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setValue('address.state', '');
    setValue('address.city', '');
    if (country) {
      setUserLocation((prev: UserLocationType) => ({ ...prev, country }));
    }
  };

  const handleStateChange = (state: IState | null) => {
    setSelectedState(state);
    setSelectedCity(null);
    setValue('address.city', '');
    if (state) {
      setUserLocation((prev: UserLocationType) => ({ ...prev, state }));
    }
  };

  const handleCityChange = (city: ICity | null) => {
    setSelectedCity(city);
    if (city) {
      setUserLocation((prev: UserLocationType) => ({ ...prev, city }));
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

      {states.length > 0 && (
        <CustomAutocomplete
          errors={errors}
          field="address.state"
          getValues={getValues}
          label="State"
          options={states}
          previousField="address.country"
          setValue={setValue}
          setterCallback={handleStateChange}
        />
      )}

      {cities.length > 0 && (
        <CustomAutocomplete
          errors={errors}
          field="address.city"
          getValues={getValues}
          label="City"
          options={cities}
          previousField="address.state"
          setValue={setValue}
          setterCallback={handleCityChange}
        />
      )}
    </Box>
  );
};

export default UserLocation;
