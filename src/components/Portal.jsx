import classNames from 'classnames';
import * as PropTypes from 'prop-types';
import React from 'react';
import * as ReactDOM from 'react-dom';

class Portal extends React.PureComponent {
  constructor(props) {
    super(props);

    const { getContainer } = this.props;

    const container = getContainer == null ? document.body : getContainer();
    this.container = container;

    this.wrapper = document.createElement('div');

    container.appendChild(this.wrapper);
  }

  componentDidMount() {
    const { onContainerChange } = this.props;
    onContainerChange(this.container);
  }

  componentWillUnmount() {
    this.wrapper.parentNode.removeChild(this.wrapper);
  }

  render() {
    const child = React.Children.only(this.props.children || (<></>));

    return ReactDOM.createPortal(React.cloneElement(child, {
      className: classNames(child.props.className, this.props.className),
    }), this.wrapper);
  }
}

Portal.propTypes = {
  getContainer: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  onContainerChange: PropTypes.func,
};

Portal.defaultProps = {
  children: null,
  className: null,
  getContainer: null,
  onContainerChange: () => {},
};

export default Portal;
