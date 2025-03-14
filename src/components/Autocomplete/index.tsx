import { RegisterField, UserType } from '@/types';
import { Autocomplete, TextField } from '@mui/material';
import { ComponentProps, Dispatch, SetStateAction } from 'react';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';

export interface CustomAutocompleteProps<T> extends ComponentProps<'select'> {
  getValues: UseFormGetValues<UserType>;
  errors: FieldErrors<UserType>;
  options: T[];
  setValue: UseFormSetValue<UserType>;
  setterCallback: Dispatch<SetStateAction<T>>;
  field: RegisterField;
  previousField: RegisterField;
  label: string;
}

const CustomAutocomplete = <T extends { name: string }>({
  getValues,
  errors,
  options,
  setValue,
  setterCallback,
  field,
  previousField,
  label,
}: CustomAutocompleteProps<T>) => {
  return (
    <Autocomplete
      style={{ width: '100%', marginBottom: '1em' }}
      hidden={
        !getValues(previousField) &&
        !errors[previousField as keyof FieldErrors<UserType>]
      }
      disablePortal
      options={options}
      getOptionLabel={(option: T) => option.name}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={errors?.address?.country?.message}
          label={label}
        />
      )}
      onChange={(_event, newValue) => {
        if (!newValue) return;
        setterCallback(newValue);
        setValue(field, newValue.name);
      }}
    />
  );
};

export default CustomAutocomplete;
