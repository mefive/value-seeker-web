import { Col, Row } from 'antd';
import React from 'react';
import { mt } from '../style/utils';

function Query(props: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div css={mt(-2)}>
      <Row gutter={16}>{props.children}</Row>
    </div>
  );
}

function QueryItem(props: {
  id?: string;
  label?: string;
  control?: JSX.Element | string;
  children?: JSX.Element | JSX.Element[];
  className?: string;
}) {
  const { id, label, control, children, className } = props;
  return (
    <Col
      xs={24}
      sm={12}
      md={12}
      lg={8}
      xl={8}
      xxl={6}
      className={className}
      css={mt(2)}
    >
      {label == null ? (
        children
      ) : (
        <div css="display: flex;align-items: center">
          <label htmlFor={id}>{label}：</label>
          <div css="flex: 1">{control}</div>
        </div>
      )}
    </Col>
  );
}

export { Query, QueryItem };
