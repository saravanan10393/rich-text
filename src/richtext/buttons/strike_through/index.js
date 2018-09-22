import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';

import { haveMark, formatPlugin } from '../../util';
import { BUTTONS } from '../../constant';

import styles from '../../editor.css';

export class StrikeButton extends React.Component {
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
    let mark = haveMark(BUTTONS.STRIKE_THROUGH, this.props.change);
    if(mark && !this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).removeMark(BUTTONS.STRIKE_THROUGH).focus();
    } else if(!this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).addMark(BUTTONS.STRIKE_THROUGH).focus();
    }else{
      this.props.change.toggleMark(BUTTONS.STRIKE_THROUGH).focus();
    }
    this.props.onChange(this.props.change);
  }

  render() {
    let onClick = (e) => this.toggleMark(BUTTONS.STRIKE_THROUGH, e);
    let isActive = classSet({ [this.props.activeClass]: haveMark(BUTTONS.STRIKE_THROUGH, this.props.change) });
    return (
      <div className={`${styles.icon} ${isActive}`} onClick={onClick}>
        <Isvg src={require('./icons8-strikethrough.svg')} cacheGetRequests={ true }/>
      </div>
    );
  }
}

export function StrikePlugin(tagName) {
  let shortCutKey = 'mod+l';
  return formatPlugin(BUTTONS.STRIKE_THROUGH, shortCutKey);
}
