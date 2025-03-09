import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useResetForm } from '../useResetForm';

describe('useResetForm', () => {
  const resetField = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call resetField when watchField changes and dependentFields is a string', () => {
    let watchValue = 'initial';
    const { rerender } = renderHook(
      ({ watchField }) => useResetForm(watchField, resetField, 'field1'),
      { initialProps: { watchField: watchValue } },
    );

    expect(resetField).not.toHaveBeenCalled();

    watchValue = 'changed';
    rerender({ watchField: watchValue });
    expect(resetField).toHaveBeenCalledTimes(1);
    expect(resetField).toHaveBeenCalledWith('field1');
  });

  it('should call resetField for each field when dependentFields is an array', () => {
    let watchValue = 'initial';
    const dependentFields = ['field1', 'field2'];
    const { rerender } = renderHook(
      ({ watchField }) => useResetForm(watchField, resetField, dependentFields),
      { initialProps: { watchField: watchValue } },
    );

    expect(resetField).not.toHaveBeenCalled();

    watchValue = 'changed';
    rerender({ watchField: watchValue });
    expect(resetField).toHaveBeenCalledTimes(dependentFields.length);
    dependentFields.forEach((field) => {
      expect(resetField).toHaveBeenCalledWith(field);
    });
  });

  it('should not call resetField if watchField does not change', () => {
    const { rerender } = renderHook(
      ({ watchField }) => useResetForm(watchField, resetField, 'field1'),
      { initialProps: { watchField: 'constant' } },
    );

    expect(resetField).not.toHaveBeenCalled();

    rerender({ watchField: 'constant' });
    expect(resetField).not.toHaveBeenCalled();
  });
});
