export interface BaseEntity {
  id: string;
  name: string;
}

export type Entities<T> = {
  [s: string]: T;
};

export interface Option {
  key: string;
  value?: string;
  label: string;
}

export interface PagingRequest {
  page?: number;
  size?: number;
  searchName?: string;
}

export interface PagingResponse<T> {
  result: T[],
  totalNumber: number;
}

export interface PagingSuccess<T> {
  entities: Entities<T>;
  ids: string[];
  total: number;
}

export type TreeNode<T = {}> = T & BaseEntity & {
  parentId: string | null;
  pathname: string;
  children?: (T & TreeNode)[];
  childrenIds?: string[];
  level: number;
  showOrder?: number;
};

export type IdTreeNode<T = {}> = T & {
  id: string;
  pathname?: string;
  children?: (T & Omit<IdTreeNode, 'children'>)[];
  level?: number;
};

export interface TreeSuccess<T extends TreeNode = TreeNode> {
  idTree: IdTreeNode[];
  entities: Entities<T>;
}

interface Column<T = {}> {
  key?: string;
  title: string | JSX.Element;
  dataIndex?: string;
  minWidth?: number;
  width?: number;
  render?: (text: any, record: T) => JSX.Element | string;
  align?: 'center' | 'right' | 'left';
  onSort?: (order: 'descend' | 'ascend') => void;
  onCell?: (record: T) => object;
}
