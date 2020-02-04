import { BaseTreeNode } from 'types';

export type Menu = BaseTreeNode<{
  code: string;
  title: string;
  url: string;
  icon: string;
  pathname: string;
  children?: Menu[];
}>;

export const menus: Menu[] = [
  {
    code: 'basic',
    title: '基础信息',
    url: '/basic',
    pathname: 'basic',
    icon: 'stock',
  },
  {
    code: 'qhStrategy',
    title: '庆辉交易策略',
    url: '/qh-strategy',
    pathname: 'qhStrategy',
    icon: 'fire',
  },
];
