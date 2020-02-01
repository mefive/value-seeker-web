import * as PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import { palette, spacing } from '../app/style/utils';

function Tabs(props) {
  const {
    className, value, onChange, children, inverted, size, disabled, bgColor, tabColor, textColor,
  } = props;

  const style = {
    inverted,
    size,
    disabled,
    bgColor,
    tabColor,
    textColor,
  };

  const keys = React.Children.map(children, ({ key }) => key, null);

  const slideProps = key => ({
    onClick: () => {
      if (!disabled) {
        if (keys.length === 2) {
          // toggle switch if has two slide
          onChange(keys[keys.indexOf(value) ? 0 : 1]);
        } else if (value !== key) {
          onChange(key);
        }
      }
    },
    active: key === value,
    ...style,
  });

  return (
    <Container className={className} {...style}>
      {React.Children.map(children, child => {
        const { key, props: { children: grandsons, value: v } } = child;

        return React.cloneElement(child, slideProps(v == null ? key : v), grandsons);
      }, null)}
    </Container>
  );
}

Tabs.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  inverted: PropTypes.bool,
  size: PropTypes.string,
  disabled: PropTypes.bool,

  bgColor: PropTypes.string,
  tabColor: PropTypes.string,
  textColor: PropTypes.string,
};

Tabs.defaultProps = {
  value: null,
  onChange: null,
  className: null,
  children: null,
  inverted: false,
  size: 'default',
  disabled: false,
  bgColor: 'white',
  tabColor: 'primaryDark',
  textColor: 'primaryDark',
};

export default Tabs;

const height = size => {
  switch (size) {
    case 'large':
      return 5;
    case 'small':
      return 3;
    default:
      return 4;
  }
};

const Container = styled.div`
  display: flex;
  padding: 2px;
  border-radius: 6px;
  
  ${props => css`
    background-color: ${palette(props.bgColor)};
    height: ${spacing(height(props.size))}px;
  `}
`;

export const Tab = styled.div`
  flex: 1;
  min-width: 0;
  text-align: center;
  transition: all .36s;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-radius: 5px;
  
  ${props => css`
    line-height: calc(${spacing(height(props.size))}px - 4px);
  `}
  
  ${({
    active, inverted, tabColor, disabled, textColor,
  }) => css`
    color: ${inverted ? '#fff' : palette(textColor)};
    
    ${active && css`
      background-color: ${palette(tabColor)};
      color: ${inverted ? palette(textColor) : '#fff'};
    `};
    
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
  `}
`;
