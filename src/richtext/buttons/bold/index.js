import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';
import { Mark } from 'slate';

import { haveMark, formatPlugin } from '../../util';
import { BUTTONS } from '../../constant';

import styles from '../../editor.css';

export class BoldButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  toggleMark(type, e) {
    //e.preventDefault();
    let selectRange = {
      anchorKey: this.props.change.value.startKey,
      anchorOffset: this.props.change.value.startBlock.text.length,
      isFocused: true,
      object: 'range'
    };
    let mark = haveMark(BUTTONS.BOLD, this.props.change);
    if(mark && !this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).removeMark(BUTTONS.BOLD).focus();
    } else if(!this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).addMark(BUTTONS.BOLD).focus();
    }else{
      this.props.change.toggleMark(BUTTONS.BOLD).focus();
    }
    console.log('new change', this.props.change.value.toJSON());
    this.props.onChange(this.props.change);
  }

  render() {
    let onClick = (e) => this.toggleMark(BUTTONS.BOLD, e);
    let isActive = classSet({ [this.props.activeClass]: haveMark(BUTTONS.BOLD, this.props.change) });
    return (
      <div className={`${styles.icon} ${isActive}`} onClick={onClick}>
        <Isvg src={require('./icons8-bold.svg')} cacheGetRequests={ true }/>
      </div>
    );
  }
}

export function BoldPlugin(tagName) {
  let shortCutKey = 'mod+b';
  return formatPlugin(BUTTONS.BOLD, shortCutKey);
}
