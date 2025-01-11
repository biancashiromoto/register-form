import { useEffect } from 'react';
import { UseFormResetField } from 'react-hook-form';

export const useResetForm = (
  watchField: string | number | undefined,
  resetField: UseFormResetField<any>,
  dependentFieldName: string,
  validationLength = 2,
) => {
  useEffect(() => {
    if (!watchField) {
      resetField(dependentFieldName);
    }
  }, [watchField, resetField, dependentFieldName, validationLength]);
};
