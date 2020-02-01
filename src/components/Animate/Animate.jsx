import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import React from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';

import './style.less';

function Animate(props) {
  const {
    children,
    activeClass,
    enterClassName, enterDuration,
    leaveClassName, leaveDuration,
    onEnter, onEntered, onEntering,
  } = props;

  return (
    <TransitionGroup>
      {children && React.Children.map(children, child => (
        <Transition
          key={child.key || 'single'}
          in
          timeout={{
            enter: enterDuration,
            exit: leaveDuration,
          }}
          onEnter={onEnter}
          onEntering={onEntering}
          onEntered={onEntered}
          unmountOnExit
        >
          {state => React.cloneElement(child, {
            className: classNames(child.props.className, 'animation', {
              [enterClassName]: state === 'entering',
              [activeClass]: state === 'entered',
              [leaveClassName]: state === 'exiting' || state === 'exited',
            }),
          })}
        </Transition>
      ))}
    </TransitionGroup>
  );
}

Animate.propTypes = {
  enterClassName: PropTypes.string,
  leaveClassName: PropTypes.string,
  enterDuration: PropTypes.number,
  leaveDuration: PropTypes.number,
  activeClass: PropTypes.string,
  children: PropTypes.node,
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
};

Animate.defaultProps = {
  enterDuration: 200,
  leaveDuration: 200,
  enterClassName: 'enter',
  leaveClassName: 'leave',
  activeClass: 'active',
  children: null,
  onEnter: () => {},
  onEntering: () => {},
  onEntered: () => {},
};

export default Animate;
