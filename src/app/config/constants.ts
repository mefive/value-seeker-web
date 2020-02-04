export const basename = '/';

export const pagerShowTotal = (total: number, range: number[]) =>
  `第${range[0]}-${range[1]}条，共${total}条`;
