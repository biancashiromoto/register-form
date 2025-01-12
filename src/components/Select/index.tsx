import { filterCountries } from '@/helpers';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export type SelectProps = {
  setValue: any;
  errors: any;
  shouldShow: boolean;
  register?: any;
  name: string;
  options: any[];
  label?: string;
  displayedValue: string;
  showIso?: boolean;
};

export default function Select({
  setValue,
  errors,
  shouldShow,
  register,
  name,
  options,
  displayedValue,
  label,
  showIso = false,
}: SelectProps) {
  return (
    shouldShow && (
      <Autocomplete
        onChange={(_event, newValue) => {
          if (!newValue) return;
          setValue(name, newValue[displayedValue] || '');
        }}
        id={name}
        options={options}
        autoHighlight
        groupBy={(option) => option.name[0]}
        filterOptions={(options, state) => filterCountries({ options, state })}
        getOptionLabel={(option: any) => option[displayedValue]}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={`${key}-${Math.random()}`}
              component="li"
              {...optionProps}
            >
              {option[displayedValue]} {showIso && `(${option.isoCode})`}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...register(name)}
            error={!!errors[name]}
            helperText={errors?.message}
            {...params}
            label={label}
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
