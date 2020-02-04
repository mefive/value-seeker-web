import { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { ValuesType } from 'utility-types';
import { useForm } from '../../lib/hooks';

function useQuery<T extends object>(data: T) {
  const { bind, reset, values, dirty } = useForm<T>({ defaultValues: data });

  useEffect(() => {
    reset(data);
  }, Object.values(data));

  const query = useMemo<T>(
    () =>
      _.mapValues(values, (v: ValuesType<T>) =>
        typeof v === 'string' ? v.trim() : v,
      ) as T,
    [values],
  );

  return { bind, query, dirty, reset };
}

export default useQuery;
