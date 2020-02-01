import { ColProps } from 'antd/es/col';

export const dialogFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export const pageFormLayout = {
  item: {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  },

  trail: {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  },
};

export const treeDetailLayout: {
  gutter: number;
  tree: Partial<ColProps>;
  detail: Partial<ColProps>;
} = {
  gutter: 24,
  tree: {
    xl: 6,
    lg: 8,
    xs: 24,
  },
  detail: {
    xl: 18,
    lg: 16,
    xs: 24,
  },
};

export type FormLayout = typeof dialogFormItemLayout;
