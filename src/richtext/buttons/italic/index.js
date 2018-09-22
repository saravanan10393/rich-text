import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';

import { haveMark, formatPlugin } from '../../util';
import { BUTTONS } from '../../constant';

import styles from '../../editor.css';

export class ItalicButton extends React.Component {
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
    let mark = haveMark(BUTTONS.ITALIC, this.props.change);
    if(mark && !this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).removeMark(BUTTONS.ITALIC).focus();
    } else if(!this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).addMark(BUTTONS.ITALIC).focus();
    }else{
      this.props.change.toggleMark(BUTTONS.ITALIC).focus();
    }
    this.props.onChange(this.props.change);
  }

  render() {
    let onClick = (e) => this.toggleMark(BUTTONS.ITALIC, e);
    let isActive = classSet({ [this.props.activeClass]: haveMark(BUTTONS.ITALIC, this.props.change) });
    return (
      <div className={`${styles.icon} ${isActive}`} onClick={onClick}>
        <Isvg src={require('./icons8-italic.svg')} cacheGetRequests={ true }/>
      </div>
    );
  }
}

export function ItalicPlugin(tagName) {
  let shortCutKey = 'mod+i';
  return formatPlugin(BUTTONS.ITALIC, shortCutKey);
}
