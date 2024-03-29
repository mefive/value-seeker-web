import { Col, Row } from 'antd';
import React from 'react';
import { mt } from '../style/utils';

function Query(props: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div
      css={`
        ${mt(-2)};
        overflow: hidden;
      `}
    >
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
  span?: number;
}) {
  const { id, label, control, children, className, span } = props;
  return (
    <Col
      xs={span ?? 24}
      sm={span ?? 12}
      md={span ?? 12}
      lg={span ?? 8}
      xl={span ?? 8}
      xxl={span ?? 6}
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
