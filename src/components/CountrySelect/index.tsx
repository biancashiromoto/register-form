import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useFetchCountries from '@/hooks/useFetchCountries';
import { CountryType } from '@/types';

const filterCountries = ({ options, state }: any) => {
  const inputValue = state.inputValue.toLowerCase();
  return options.filter(
    (option: CountryType) =>
      option.nameEng?.toLowerCase().includes(inputValue) ||
      option.code.toLowerCase().includes(inputValue),
  );
};

type CountrySelectProps = {
  setValue: (field: string, value: any) => void;
};

export default function CountrySelect({ setValue }: CountrySelectProps) {
  const { countries = [] } = useFetchCountries();

  const sortedCountries = [...countries].sort((a, b) =>
    a.nameEng.localeCompare(b.nameEng, 'en', { sensitivity: 'base' }),
  );

  return (
    <Autocomplete
      onChange={(event, newValue) => {
        // Aqui é onde você realmente captura o "país" selecionado
        // e notifica o React Hook Form. Supondo que seu schema
        // tenha "countryCode" como campo:
        setValue('countryCode', newValue?.code || '');
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
      getOptionLabel={(option: CountryType) => option.code}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            key={`${key}-${Math.random()}`}
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            <img
              loading="lazy"
              width="20"
              srcSet={option.flag?.src}
              alt={option.flag?.altText || `${option.nameEng} flag`}
              src={option.flag?.src}
            />
            {option.code} ({option.nameEng})
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          aria-label="Choose a country"
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
