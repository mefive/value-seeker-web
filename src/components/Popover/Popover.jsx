import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {
  BOTTOM,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  LEFT,
  LEFT_BOTTOM,
  LEFT_TOP,
  RIGHT,
  RIGHT_BOTTOM,
  RIGHT_TOP,
  TOP,
  TOP_LEFT,
  TOP_RIGHT,
} from './constants';

class Popover extends React.PureComponent {
  constructor(props) {
    super(props);
    const { placement } = this.props;

    this.state = {
      style: {
        left: 0,
        top: 0,
      },
      placement,
    };

    this.place = this.place.bind(this);
    this.onResize = _.debounce(this.place);
  }

  componentDidMount() {
    this.hasMounted = true;
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this.hasMounted = false;
    window.removeEventListener('resize', this.onResize);
  }

  getPlaceStyleInfo(placement) {
    const { container, anchor, offset } = this.props;
    const containerRect = container.getBoundingClientRect();

    const anchorRect = anchor.getBoundingClientRect();
    const anchorHeight = anchorRect.height;
    const anchorWidth = anchorRect.width;

    const popoverHeight = this.node.offsetHeight;
    const popoverWidth = this.node.offsetWidth;

    const betterPlacement = [];

    let left = 0;
    let top = 0;
    let marginLeft = 0;
    let marginTop = 0;

    const placements = placement.split('-');

    // handle offset as margin
    switch (placements[0]) {
      case TOP: {
        marginTop = -offset;
        break;
      }

      case BOTTOM: {
        marginTop = offset;
        break;
      }

      case LEFT: {
        marginLeft = -offset;
        break;
      }

      case RIGHT: {
        marginLeft = offset;
        break;
      }

      default:
        break;
    }

    // handle primary placement
    switch (placements[0]) {
      case TOP: {
        top = anchorRect.top - popoverHeight - containerRect.top;
        break;
      }

      case BOTTOM: {
        top = (anchorRect.top + anchorHeight) - containerRect.top;
        break;
      }

      case LEFT: {
        left = anchorRect.left - popoverWidth - containerRect.left;
        break;
      }

      case RIGHT: {
        left = (anchorRect.left + anchorWidth) - containerRect.left;
        break;
      }

      default:
        break;
    }

    // handle primary placement align, treat as center alignment
    switch (placements[0]) {
      case TOP:
      case BOTTOM: {
        left = (anchorRect.left - containerRect.left) + (0.5 * (anchorWidth - popoverWidth));
        break;
      }

      case LEFT:
      case RIGHT: {
        top = (anchorRect.top - containerRect.top) + (0.5 * (anchorHeight - popoverHeight));
        break;
      }

      default:
        break;
    }

    // if has secondary placement, use it to modify alignment
    switch (placements[1]) {
      case LEFT: {
        left -= (0.5 * (anchorWidth - popoverWidth));
        break;
      }

      case RIGHT: {
        left += (0.5 * (anchorWidth - popoverWidth));
        break;
      }

      case TOP: {
        top -= (0.5 * (anchorHeight - popoverHeight));
        break;
      }

      case BOTTOM: {
        top += (0.5 * (anchorHeight - popoverHeight));
        break;
      }

      default:
        break;
    }

    if (container !== document.body) {
      top += container.scrollTop;
      left += container.scrollLeft;
    }

    // build a better placement, avoid overflowing of the container's edge
    switch (placements[0]) {
      case TOP: {
        if (top < 0) {
          betterPlacement[0] = BOTTOM;
        }
        break;
      }

      case BOTTOM: {
        if ((containerRect.top + top + popoverHeight) > containerRect.bottom) {
          betterPlacement[0] = TOP;
        }
        break;
      }

      case LEFT: {
        if (left < 0) {
          betterPlacement[0] = RIGHT;
        }
        break;
      }

      case RIGHT: {
        if ((containerRect.left + left + popoverWidth) > containerRect.right) {
          betterPlacement[0] = LEFT;
        }
        break;
      }

      default:
        break;
    }

    switch (placements[1]) {
      case LEFT: {
        if (left + popoverWidth > containerRect.right) {
          betterPlacement[1] = RIGHT;
        }
        break;
      }

      case RIGHT: {
        if (left < containerRect.left) {
          betterPlacement[1] = LEFT;
        }
        break;
      }

      case TOP: {
        if (top + popoverHeight > containerRect.bottom) {
          betterPlacement[1] = BOTTOM;
        }
        break;
      }

      case BOTTOM: {
        if (top < containerRect.top) {
          betterPlacement[1] = TOP;
        }
        break;
      }

      default:
        break;
    }

    if (!Number.isNaN(left)
      && !Number.isNaN(top)
      && !Number.isNaN(marginLeft)
      && !Number.isNaN(marginTop)
    ) {
      return {
        style: {
          left, top, marginLeft, marginTop,
        },
        betterPlacement: placements.map((p, index) => betterPlacement[index] || p).join('-'),
      };
    }

    console.error('placement error: you should not seen these', container, anchor);
    return { style: null };
  }

  place() {
    const { container, anchor, placement } = this.props;

    if (!this.hasMounted || container == null || anchor == null) {
      return;
    }

    const placeStyleInfo = this.getPlaceStyleInfo(placement);
    let betterPlaceStyleInfo = placeStyleInfo;
    let { betterPlacement } = betterPlaceStyleInfo;

    if (betterPlacement !== placement) {
      betterPlaceStyleInfo = this.getPlaceStyleInfo(placeStyleInfo.betterPlacement);

      if (betterPlaceStyleInfo.betterPlacement !== placeStyleInfo.betterPlacement) {
        // treat origin placement as better placement, cause neither is fit
        ({ betterPlacement } = betterPlaceStyleInfo);
        betterPlaceStyleInfo = placeStyleInfo;
      }

      this.setState({ placement: betterPlacement });
    }

    if (placeStyleInfo.style) {
      this.setState({ style: betterPlaceStyleInfo.style });
    }
  }

  render() {
    const { className, style, children } = this.props;
    const { style: innerStyle } = this.state;
    let { placement } = this.state;

    placement = placement.split('-');

    return (
      <div
        className={
          classNames(
            placement[1],
            className,
          )
        }
        style={{
          ...style,
          ...innerStyle,
          position: 'absolute',
        }}
        ref={el => { this.node = el; }}
      >
        <>
          {children}
        </>
      </div>
    );
  }
}

export default Popover;

const placement = {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  LEFT_TOP,
  LEFT_BOTTOM,
  RIGHT_TOP,
  RIGHT_BOTTOM,
};

Popover.placement = placement;

Popover.propTypes = {
  className: PropTypes.string,
  placement: PropTypes.string,
  container: PropTypes.instanceOf(HTMLElement),
  anchor: PropTypes.instanceOf(HTMLElement),
  offset: PropTypes.number,
  children: PropTypes.node,
  style: PropTypes.shape({}),
};

Popover.defaultProps = {
  className: null,
  container: null,
  anchor: null,
  placement: TOP,
  offset: 0,
  children: null,
  style: {},
};
