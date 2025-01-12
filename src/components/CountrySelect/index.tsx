import { filterCountries } from '@/helpers';
import useFetchCountries from '@/hooks/useFetchCountries';
import { CountryType } from '@/types';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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
  const { countries = [], isLoading, isFetching } = useFetchCountries();

  const sortedCountries = [...countries].sort((a, b) =>
    a.nameEng.localeCompare(b.nameEng, 'en', { sensitivity: 'base' }),
  );

  return (
    shouldShow && (
      <Autocomplete
        loading={isLoading || isFetching}
        onChange={(_event, newValue) => {
          setValue('country', newValue?.nameEng || '');
        }}
        id="country-select"
        options={sortedCountries}
        autoHighlight
        groupBy={(option) =>
          option.nameEng
            .charAt(0)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
        }
        filterOptions={(options, state) => filterCountries({ options, state })}
        getOptionLabel={(option: CountryType) => option.nameEng}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={`${key}-${Math.random()}`}
              component="li"
              {...optionProps}
              sx={{ '& > img': { mr: 2, flexShrink: 5 } }}
            >
              <img
                role="img"
                loading="lazy"
                width="20"
                srcSet={option.flag?.src}
                alt={option.flag?.altText || `${option.nameEng} flag`}
                src={option.flag?.src}
              />
              {option.nameEng}
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
