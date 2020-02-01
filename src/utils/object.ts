import _ from 'lodash';

export function composeSkipNull<T1, T2>(object: T1, source: T2) {
  return _.assignWith<{}, T1, T2>({}, object, source, (a, b) => (a == null ? b : a));
}
