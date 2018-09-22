import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export class Portal extends React.Component {
  static propTypes = {
    onOutClick: PropTypes.func,
    offsetParent: PropTypes.node,
    children: PropTypes.any
  };

  constructor(props, context) {
    super(props, context);

    this.node = document.createElement('div');
    document.body.appendChild(this.node);

    this.root = null;
    this.handleRootRef = (root) => {
      if (root !== this.root) {
        if (this.root) {
          this.root.removeEventListener('click', this.handleInClick);
        }
        if (root) {
          root.addEventListener('click', this.handleInClick);
        }
      }
      this.root = root;
    };

    // The previous implementation triggered `onOutClick` after a click in the `Portal` content
    // if it gets re-rendered during that click. It assumed that if the clicked element
    // is not found in the root element via `root.contains(e.target)`, it's outside.
    // But if after re-render the clicked element gets removed from the DOM, so it cannot be found
    // in the root element. Instead we capture and flag the click event before it bubbles up
    // to the `document` to be handled by `handleOutClick`.
    this.isInClick = false;
    this.handleInClick = () => {
      this.isInClick = true;
    };

    this.handleOutClick = () => {
      const isOutClick = !this.isInClick;
      this.isInClick = false;

      const { onOutClick } = this.props;
      if (isOutClick && typeof onOutClick === 'function') {
        onOutClick();
      }
    };

    document.addEventListener('click', this.handleOutClick);
  }

  componentWillUnmount() {
    // `this.handleRootRef` won't be called with `null`, so cleanup here.
    if (this.root) {
      this.root.removeEventListener('click', this.handleInClick);
    }
    document.removeEventListener('click', this.handleOutClick);
    document.body.removeChild(this.node);
  }

  render() {
    const { onOutClick, offsetParent, ...props } = this.props;
    return ReactDOM.createPortal(
      <div {...props} ref={this.handleRootRef}>{this.props.children}</div>,
      offsetParent || this.node
    );
  }
}
