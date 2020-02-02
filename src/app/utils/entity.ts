import { Entities } from 'types.ts';
import { composeSkipNull } from '../../utils/object';

export function mergeEntities<T>(object: Entities<T>, source: Entities<T>, key: keyof T): void {
  Object.values(source).forEach(o => {
    const k = `${o[key]}`;
    object[k] = composeSkipNull<T, T>(o, object[k]);
  });
}
