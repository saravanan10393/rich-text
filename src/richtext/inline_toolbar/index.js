import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BoldButton } from '../buttons/bold';
import { ItalicButton } from '../buttons/italic';
import { UnderlineButton } from '../buttons/underline';
import { StrikeButton } from '../buttons/strike_through';
import { InlineLinkButton } from '../buttons/link';
import { getVisibleSelectionRect } from '../util';

import styles from './toolbar.css';

export class InlineToolbar extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  constructor(props) {
    super(props);
    this.toolbarRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEsc);
  }

  componentDidUpdate() {
    this.placeInlineToolbar();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  }

  placeInlineToolbar() {
    if(!this.props.value.isExpanded) {
      this.toolbarRef.current.setAttribute('style', 'opacity:0; left: -999rem');
      return;
    }
    requestAnimationFrame(() => {
      let selectionRect = getVisibleSelectionRect();
      if(!selectionRect) return;
      let sectionMidX = selectionRect.left + (selectionRect.width / 2);
      let toolBarElemPos = this.toolbarRef.current.getBoundingClientRect();
      let top = selectionRect.top - (toolBarElemPos.height + 10);
      let left = sectionMidX - (toolBarElemPos.width / 2);
      //find center position of select
      if(this.toolbarRef.current) {
        this.toolbarRef.current.setAttribute("style", `left:${left}px; top: ${top}px; opacity:1;`);
      }
    });
  }

  handleEsc = (evt) => {
    const ESC_KEY = 'Escape';
    if(evt.key === ESC_KEY) {
      this.toolbarRef.current.setAttribute('style', 'opacity:0; left: -999rem');
    }
  }

  render() {
    let className = `${this.props.className} ${styles.toolbarContainer}`;
    return (
      <div ref={this.toolbarRef} className={className}>
        <BoldButton change={this.props.value.change()} onChange={this.props.onChange}/>
        <ItalicButton change={this.props.value.change()} onChange={this.props.onChange}/>
        <UnderlineButton change={this.props.value.change()} onChange={this.props.onChange}/>
        <StrikeButton change={this.props.value.change()} onChange={this.props.onChange}/>
        <InlineLinkButton change={this.props.value.change()} onChange={this.props.onChange}/>
      </div>
    );
  }
}
