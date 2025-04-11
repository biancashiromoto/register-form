import { RegisterField, UserType } from '@/types';
import { Autocomplete, TextField } from '@mui/material';
import {
  ComponentProps,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
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
  setterCallback:
    | Dispatch<SetStateAction<T>>
    | ((value: T | null) => void)
    | any;
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
  const [inputValue, setInputValue] = useState('');
  const [value, setValue_] = useState<T | null>(null);

  useEffect(() => {
    const currentValue = getValues(field);
    if (!currentValue && value !== null) {
      setValue_(null);
      setInputValue('');
      setterCallback(null);
    }
  }, [getValues, field, setterCallback, value]);

  useEffect(() => {
    const previousValue = getValues(previousField);
    if (!previousValue) {
      setValue_(null);
      setInputValue('');
      setValue(field, '');
      setterCallback(null);
    }
  }, [getValues, previousField, field, setValue, setterCallback]);

  const hidden =
    !getValues(previousField) &&
    !errors[previousField as keyof FieldErrors<UserType>];

  if (hidden) {
    return null;
  }

  return (
    <Autocomplete
      style={{ width: '100%' }}
      disablePortal
      options={options}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        if (!newInputValue) {
          setValue_(null);
          setValue(field, '');
          setterCallback(null);
        }
      }}
      onChange={(_event, newValue) => {
        setValue_(newValue);
        setValue(field, newValue?.name || '');
        setterCallback(newValue);
      }}
      getOptionLabel={(option: T) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          error={
            !!errors?.address?.[
              field.split('.')[1] as keyof typeof errors.address
            ]
          }
          helperText={
            errors?.address?.[
              field.split('.')[1] as keyof typeof errors.address
            ]?.message
          }
          label={label}
        />
      )}
      isOptionEqualToValue={(option, value) => option.name === value?.name}
    />
  );
};

export default CustomAutocomplete;
