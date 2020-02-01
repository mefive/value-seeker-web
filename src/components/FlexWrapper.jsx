import React from 'react';
import * as PropTypes from 'prop-types';
import setStyle from 'dom-helpers/style';

class FlexWrapper extends React.PureComponent {
  state = {
    absoluteTop: null,
  };

  container = React.createRef();

  componentDidMount() {
    this.resizeContainer();
    window.addEventListener('resize', this.resizeContainer);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeContainer);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.bottom !== this.props.bottom) {
      this.resizeContainer();
    }
  }

  resizeContainer = () => {
    const {
      absolute, isFixedHeight, bottom, onHeightChange,
    } = this.props;
    const { absoluteTop } = this.state;

    const container = this.container.current;

    if (container == null) {
      return;
    }

    if (absolute) {
      if (absoluteTop != null) {
        return;
      }

      this.setState({ absoluteTop: container.offsetTop });
      return;
    }

    const { top } = container.getBoundingClientRect();

    const height = window.innerHeight - top - bottom;

    setStyle(container, {
      [isFixedHeight ? 'height' : 'minHeight']: `${height}px`,
    });

    if (onHeightChange) {
      onHeightChange(height);
    }
  };

  render() {
    const {
      children, absolute, bottom, style: outerStyle, isFixedHeight, onHeightChange, ...rest
    } = this.props;
    const { absoluteTop } = this.state;

    const style = {};

    if (absolute) {
      style.position = 'relative';

      if (absoluteTop) {
        style.position = 'absolute';
        style.left = 0;
        style.right = 0;
      }
    }

    return (
      <div
        {...rest}
        ref={this.container}
        style={{
          ...outerStyle,
          ...style,
          top: absoluteTop,
          bottom: absolute ? bottom : null,
        }}
      >
        {children}
      </div>
    );
  }
}

FlexWrapper.propTypes = {
  children: PropTypes.node,
  bottom: PropTypes.number,
  absolute: PropTypes.bool,
  style: PropTypes.shape({}),
  isFixedHeight: PropTypes.bool,
  onHeightChange: PropTypes.func,
};

FlexWrapper.defaultProps = {
  children: null,
  bottom: 0,
  absolute: false,
  style: {},
  isFixedHeight: true,
  onHeightChange: null,
};

export default FlexWrapper;
