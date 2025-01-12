import { countries, filterCountries } from '@/helpers';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { ICountry } from 'country-state-city';

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
    shouldShow && (
      <Autocomplete
        onChange={(_event, newValue) => {
          setValue('country', newValue?.name || '');
        }}
        id="country-select"
        options={countries}
        autoHighlight
        groupBy={(option) => option.name[0]}
        filterOptions={(options, state) => filterCountries({ options, state })}
        getOptionLabel={(option: ICountry) => option.name}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={`${key}-${Math.random()}`}
              component="li"
              {...optionProps}
            >
              {option.flag} {option.name}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...register('country')}
            error={!!errors.country}
            helperText={errors?.message}
            {...params}
            label="Choose a country"
            slotProps={{
              htmlInput: {
                ...params.inputProps,
                autoComplete: 'new-password',
              },
            }}
          />
        )}
      />
    )
  );
}
