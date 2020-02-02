export interface Menu {
  title: string;
  url: string;
  icon: string;
  children?: Menu[];
}

export const menus: Menu[] = [
  {
    title: '基础信息',
    url: '/basic',
    icon: 'stock',
  },
  {
    title: '庆辉交易策略',
    url: '/qh-strategy',
    icon: 'fire',
  },
];
