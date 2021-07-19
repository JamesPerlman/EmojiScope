import React, { useCallback, useEffect } from 'react';
import { usePrevious } from './usePrevious';

/**
 * @name useOnChange
 * @description - Executes a callback when the value of `value` changes from `from` to `to`
 * @template T - The type of `value`
 * @template U - The type of `callback`
 * @param {T} value - The value to compare
 * @param {T} from - The previous value of `value` to compare against
 * @param {T} to - The current value of `value` to compare against
 * @param {U} callback - The callback to execute
 */

// this `U extends Parameters<typeof useCallback>[0]` is an attempt to make this future-proof.  see the comment above `useCallback`.
export const useOnChange = <T, U extends Parameters<typeof useCallback>[0]>(
  value: T,
  from: T,
  to: T,
  callback: U,
  deps: React.DependencyList,
) => {
  const previousValue = usePrevious(value);

  const callbackWithDependencies = useCallback(callback, deps);

  useEffect(() => {
    if (value === to && previousValue === from) {
      callbackWithDependencies();
    }
  }, [value, previousValue, from, to]);
};
