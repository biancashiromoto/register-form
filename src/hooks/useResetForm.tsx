import { useEffect, useRef } from 'react';
import { UseFormResetField } from 'react-hook-form';

export const useResetForm = (
  watchField: any,
  resetField: UseFormResetField<any>,
  dependentFields: string[] | string,
) => {
  const prevValueRef = useRef<any>(watchField);

  useEffect(() => {
    if (watchField !== prevValueRef.current) {
      if (Array.isArray(dependentFields)) {
        dependentFields.forEach((field) => resetField(field));
      } else {
        resetField(dependentFields);
      }
    }
    prevValueRef.current = watchField;
  }, [watchField, resetField, dependentFields]);
};
