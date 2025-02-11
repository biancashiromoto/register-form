import { filterOptions } from '@/helpers';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export type SelectProps = {
  setValue: any;
  errors: any;
  shouldShow: boolean;
  name: string;
  options: any[];
  label?: string;
  displayedValue: string;
  showIso?: boolean;
  filterOptions?: (options: any[], state: { inputValue: string }) => any[];
};

export default function Select({
  setValue,
  errors,
  shouldShow,
  name,
  options,
  displayedValue,
  label,
  showIso = false,
}: SelectProps) {
  return (
    shouldShow && (
      <Autocomplete
        style={{ marginBottom: '24px' }}
        onChange={(_event, newValue) => {
          if (!newValue) return;
          console.log('newValue: ', name, newValue);
          setValue(name, newValue || null);
        }}
        id={name}
        options={options}
        autoHighlight
        groupBy={(option) => option.name[0]}
        filterOptions={(options, state) => filterOptions(options, state)}
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
