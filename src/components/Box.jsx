import React from 'react';
import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  spacing,
  palette,
  display,
  flexbox,
  positions,
  shadows,
  borders,
  sizing,
  typography,
} from '@material-ui/system';

function Box(props) {
  const {
    clone, children, className, style,
  } = props;

  if (clone) {
    return React.Children.map(children, child => child && React.cloneElement(
      child,
      {
        ...child.props,
        className: classNames(className, child.props.className),
      },
    ), null);
  }

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

Box.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape({}),
  clone: PropTypes.bool,
  children: PropTypes.node,
};

Box.defaultProps = {
  className: null,
  style: null,
  clone: false,
  children: null,
};

export default styled(Box)`
  ${spacing}
  ${palette}
  ${display}
  ${flexbox}
  ${positions}
  ${shadows}
  ${borders}
  ${sizing}
  ${typography}
  ${props => props.ellipsis && css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
  ${props => props.verticalAlign && css`
    vertical-align: ${props.verticalAlign};
  `}
`;
