/**
 * Code is extracted out from https://github.com/smartprogress/react-relative-portal
 * for the purpose of upgrading it to React 16.x
 *
 * Please refer the above link for documentation
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { Portal } from './portal.helper';

const listeners = {};

function fireListeners() {
  Object.keys(listeners).forEach(key => listeners[key]());
}

function getPageOffset(rootElem = window) {
  return {
    x: (rootElem.pageXOffset !== undefined) ?
      rootElem.pageXOffset :
      (rootElem || document.documentElement || document.body.parentNode || document.body).scrollLeft,
    y: (rootElem.pageYOffset !== undefined) ?
      rootElem.pageYOffset :
      (rootElem || document.documentElement || document.body.parentNode || document.body).scrollTop
  };
}

function initDOMListener() {
  document.body.addEventListener('mousewheel', () => {
    //debounce(fireListeners, 0, true)
    requestAnimationFrame(fireListeners);
  });
  window.addEventListener('resize', () => {
    //debounce(fireListeners, 0, true)
    requestAnimationFrame(fireListeners);
  });
}


if (document.body) {
  initDOMListener();
} else {
  document.addEventListener('DOMContentLoaded', initDOMListener);
}


let listenerIdCounter = 0;
function subscribe(fn) {
  listenerIdCounter += 1;
  const id = listenerIdCounter;
  listeners[id] = fn;
  return () => Reflect.deleteProperty(listeners, id);
}

export class RelativePortal extends React.Component {
  static propTypes = {
    right: PropTypes.number,
    left: PropTypes.number,
    fullWidth: PropTypes.bool,
    top: PropTypes.number,
    children: PropTypes.any,
    onOutClick: PropTypes.func,
    component: PropTypes.string.isRequired,
    className: PropTypes.string,
    offsetParent: PropTypes.node,
    style: PropTypes.object
  };

  static defaultProps = {
    left: 0,
    top: 0,
    component: 'span',
    className: '',
    style: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      right: 0,
      left: 0,
      top: 0
    };
  }

  componentDidMount() {
    this.handleScroll = () => {
      if (this.element) {
        const rect = this.element.getBoundingClientRect();
        const pageOffset = getPageOffset(this.props.offsetParent);
        const top = pageOffset.y + rect.top;
        const right = window.innerWidth - rect.right - pageOffset.x;
        const left = pageOffset.x + rect.left;

        if (top !== this.state.top || left !== this.state.left || right !== this.state.right) {
          this.setState({ left, top, right });
        }
      }
    };
    this.unsubscribe = subscribe(this.handleScroll);
    this.handleScroll();
  }

  componentDidUpdate() {
    requestAnimationFrame(() => this.handleScroll());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { component: Comp, top, left, right, fullWidth, className, ...props } = this.props;

    const fromLeftOrRight = right !== undefined ?
      { right: this.state.right + right } :
      { left: this.state.left + left };

    const horizontalPosition = fullWidth ?
      { right: this.state.right + right, left: this.state.left + left } : fromLeftOrRight;

    return (
      <Comp
        ref={element => {
          this.element = element;
        }}
      >
        <Portal {...props}>
          <div
            className={className}
            style={Object.assign({
              zIndex: 2000,
              position: 'absolute',
              top: this.state.top + top,
              ...horizontalPosition
            }, this.props.style)}
          >
            {this.props.children}
          </div>
        </Portal>
      </Comp>
    );
  }
}
