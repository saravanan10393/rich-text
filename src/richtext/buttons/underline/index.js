import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';

import { haveMark, formatPlugin } from '../../util';
import { BUTTONS } from '../../constant';

import styles from '../../editor.css';

export class UnderlineButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  toggleMark(type, e) {
    let selectRange = {
      anchorKey: this.props.change.value.startKey,
      anchorOffset: this.props.change.value.startBlock.text.length,
      isFocused: true,
      object: 'range'
    };
    let mark = haveMark(BUTTONS.UNDERLINE, this.props.change);
    if(mark && !this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).removeMark(BUTTONS.UNDERLINE).focus();
    } else if(!this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).addMark(BUTTONS.UNDERLINE).focus();
    }else{
      this.props.change.toggleMark(BUTTONS.UNDERLINE).focus();
    }
    this.props.onChange(this.props.change);
  }

  render() {
    let onClick = (e) => this.toggleMark(BUTTONS.UNDERLINE, e);
    let isActive = classSet({ [this.props.activeClass]: haveMark(BUTTONS.UNDERLINE, this.props.change) });
    return (
      <div className={`${styles.icon} ${isActive}`} onClick={onClick}>
        <Isvg src={require('./icons8-underline.svg')} cacheGetRequests={ true }/>
      </div>
    );
  }
}

export function UnderlinePlugin(tagName) {
  let shortCutKey = 'mod+u';
  return formatPlugin(BUTTONS.UNDERLINE, shortCutKey);
}
