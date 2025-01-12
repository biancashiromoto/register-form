import { countries, filterCountries } from '@/helpers';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { ICountry } from 'country-state-city';

export type CountryCodeSelectProps = {
  setValue: (field: string, value: any) => void;
  errors: any;
};

export default function CountryCodeSelect({
  setValue,
  errors,
}: CountryCodeSelectProps) {
  return (
    <Autocomplete
      onChange={(_event, newValue) => {
        setValue('countryCode', newValue?.phonecode || '');
      }}
      id="country-code-select"
      options={countries}
      autoHighlight
      groupBy={(option) =>
        option.name
          .charAt(0)
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
      }
      filterOptions={(options, state) => filterCountries({ options, state })}
      getOptionLabel={(option: ICountry) => option.phonecode}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={`${key}-${Math.random()}`} component="li" {...optionProps}>
            {option.phonecode} ({option.isoCode})
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          error={!!errors}
          helperText={errors?.message}
          {...params}
          aria-label="Choose a country code"
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: 'new-password',
            },
          }}
        />
      )}
    />
  );
}
