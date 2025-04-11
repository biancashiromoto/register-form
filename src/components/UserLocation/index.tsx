import { Context } from '@/context';
import { UserType } from '@/types';
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
  const countries = useMemo(() => Country.getAllCountries(), []);
  const { setUserLocation, userLocation } = useContext(Context);

  const states = useMemo(() => {
    if (!userLocation.country) return [];
    return State.getStatesOfCountry(userLocation.country.isoCode);
  }, [userLocation.country]);

  const cities = useMemo(() => {
    if (!userLocation.country || !userLocation.state) return [];
    return City.getCitiesOfState(
      userLocation.country.isoCode,
      userLocation.state.isoCode,
    );
  }, [userLocation.country, userLocation.state, userLocation.city]);

  const handleCountryChange = (country: ICountry | null) => {
    setValue('address.state', '');
    setValue('address.city', '');
    if (country) {
      setUserLocation({ country, state: null, city: null });
    }
  };

  const handleStateChange = (state: IState | null) => {
    setValue('address.city', '');
    if (state) {
      setUserLocation((prev) => ({ ...prev, state, city: null }));
    }
  };

  const handleCityChange = (city: ICity | null) => {
    if (city) {
      setUserLocation((prev) => ({ ...prev, city }));
    }
  };

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={2}>
      <CustomAutocomplete
        errors={errors}
        field="address.country"
        getValues={getValues}
        label="Country"
        options={countries}
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
