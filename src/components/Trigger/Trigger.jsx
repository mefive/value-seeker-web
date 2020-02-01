import contains from 'dom-helpers/query/contains';
import PropTypes from 'prop-types';
import React from 'react';
import Animate from '../Animate';
import Portal from '../Portal';
import { CLICK, HOVER, HOVER_HOLD } from './constants';

class Trigger extends React.PureComponent {
  constructor(props) {
    super(props);
    const { active, defaultActive } = this.props;

    this.state = {
      active: active == null ? defaultActive : active,
      popoverContainer: null,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const { action } = this.props;
    const { active } = this.state;

    if (action === Trigger.action.CLICK) {
      if (active) {
        document.addEventListener('click', this.onClick);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { active } = this.props;

    if (nextProps.active !== active) {
      this.setState({ active: nextProps.active });
      this.clearTimers();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { action } = this.props;
    const { active } = this.state;

    if (action === Trigger.action.CLICK) {
      if (!prevState.active && active) {
        document.addEventListener('click', this.onClick);
      } else if (prevState.active && !active) {
        document.removeEventListener('click', this.onClick);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
    this.clearTimers();
  }

  onClick(e) {
    const { active } = this.state;

    const popover = this.popover && this.popover.node;

    if (popover == null || !contains(popover, e.target)) {
      this.setActive(!active);
    }
  }

  onMouseEnter() {
    this.setActive(true);
  }

  onMouseLeave() {
    this.setActive(false);
  }

  setActive(active, force = false) {
    const {
      enterDelay, leaveDelay, active: outerActive, onActiveChange,
    } = this.props;

    this.clearTimers();

    if (!force) {
      if (active && enterDelay) {
        this.enterDelayTimer = setTimeout(
          () => this.setActive(active, true),
          enterDelay,
        );
        return;
      }

      if (!active && leaveDelay) {
        this.leaveDelayTimer = setTimeout(
          () => this.setActive(active, true),
          leaveDelay,
        );
        return;
      }
    }

    if (outerActive == null) {
      this.setState({ active });
    }

    onActiveChange(active);
  }

  clearTimers() {
    if (this.enterDelayTimer) {
      clearTimeout(this.enterDelayTimer);
    }

    if (this.leaveDelayTimer) {
      clearTimeout(this.leaveDelayTimer);
    }
  }

  render() {
    const {
      action, children, disabled, animationProps, getPortalContainer,
    } = this.props;
    let { popover } = this.props;
    const { active, popoverContainer } = this.state;

    return React.Children.map(children, (child, index) => {
      if (index === 0) {
        const events = {};

        if (!disabled) {
          if (action === CLICK && !active) {
            events.onClick = this.onClick;
          }

          if ([HOVER, HOVER_HOLD].indexOf(action) !== -1) {
            events.onMouseEnter = this.onMouseEnter;
            events.onMouseLeave = this.onMouseLeave;
          }
        }

        return React.cloneElement(
          child,
          {
            ...events,
            ref: el => {
              if (typeof child.ref === 'function') {
                child.ref(el);
              }

              this.anchor = el;
            },
          },
        );
      }

      return child;
    }).concat((
      <Animate
        {...animationProps}
        key={React.Children.count(children)}
      >
        {active && (
          <Portal
            onContainerChange={container => this.setState({
              popoverContainer: container,
            }, this.popover.place)}
            getContainer={getPortalContainer}
          >
            {(() => {
              popover = typeof popover === 'function' ? popover() : popover;

              const events = {};

              if (action === HOVER_HOLD) {
                events.onMouseEnter = () => this.setActive(true, true);
                events.onMouseLeave = this.onMouseLeave;
              }

              return React.cloneElement(
                popover,
                {
                  ...events,
                  anchor: this.anchor,
                  container: popoverContainer,
                  ref: el => {
                    if (typeof popover.ref === 'function') {
                      popover.ref(el);
                    }

                    this.popover = el;
                  },
                },
              );
            })()}
          </Portal>
        )}
      </Animate>
    ));
  }
}

export default Trigger;

Trigger.action = {
  CLICK,
  HOVER,
  HOVER_HOLD,
};

Trigger.propTypes = {
  active: PropTypes.bool,
  onActiveChange: PropTypes.func,
  defaultActive: PropTypes.bool,
  action: PropTypes.string,
  popover: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  children: PropTypes.node,
  animationProps: PropTypes.shape({}),

  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,

  disabled: PropTypes.bool,
  getPortalContainer: PropTypes.func,
};

Trigger.defaultProps = {
  active: null,
  onActiveChange: () => {},
  defaultActive: false,
  action: CLICK,
  children: null,
  animationProps: {},

  enterDelay: null,
  leaveDelay: null,

  disabled: false,
  getPortalContainer: null,
};
