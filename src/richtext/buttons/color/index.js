import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';
import './color.picker';

import { haveMark, formatPlugin } from '../../util';
import { BUTTONS } from '../../constant';

import styles from '../../editor.css';
import colorStyles from './color.css';

export class ColorButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  }

  state = {
    color: '#333',
    isOpen: false
  }

  toggleColor(color, e) {
    let selectRange = {
      anchorKey: this.props.change.value.startKey,
      anchorOffset: this.props.change.value.startBlock.text.length,
      isFocused: true,
      object: 'range'
    };
    let mark = haveMark(BUTTONS.COLOR, this.props.change);
    if(mark && !this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).replaceMark(mark, {
        type: BUTTONS.COLOR,
        data: { color }
      }).focus();
    } else if(mark && this.props.change.value.isExpanded) {
      this.props.change.replaceMark(mark, {
        type: BUTTONS.COLOR,
        data: { color }
      }).focus();
    }else if(!this.props.change.value.isExpanded) {
      this.props.change.insertText(" ").select(selectRange).addMark({
        type: BUTTONS.COLOR,
        data: { color }
      }).focus();
    }else{
      this.props.change.toggleMark({
        type: BUTTONS.COLOR,
        data: { color }
      }).focus();
    }
    this.props.onChange(this.props.change);
  }

  setColor = () => {
    this.toggleColor(this.state.color);
  }

  toggleColorBox = () => {
    this.setState({
      isOpen: !this.state.isOpen
    }, () => {
      if(!this.state.isOpen) return;
      window.ColorPicker.fixIndicators(
        document.getElementById('slider-indicator'),
        document.getElementById('picker-indicator'));

      window.ColorPicker(
        document.getElementById('slider'),
        document.getElementById('picker'),
        (hex, hsv, rgb, pickerCoordinate, sliderCoordinate) => {
          window.ColorPicker.positionIndicators(
            document.getElementById('slider-indicator'),
            document.getElementById('picker-indicator'),
            sliderCoordinate, pickerCoordinate
          );
          this.toggleColor(hex);
          this.setState({
            color: hex
          });
        });
    });
  }

  closeColorBox = () => {
    this.setState({
      isOpen: false
    });
  }

  handleEsc = (evt) => {
    const ESC_KEY = 'Escape';
    if(evt.key === ESC_KEY) {
      this.closeColorBox();
    }
  }

  render() {
    return (
      <div className={colorStyles.colorContainer}>
        <div className={`${styles.icon}`} onClick={this.toggleColorBox}>
          <Isvg src={require('./icons8-color.svg')} cacheGetRequests={ true }/>
        </div>
        {
          this.state.isOpen &&
          <div className={colorStyles.colorBox} onClick={(e) => e.stopPropagation()}>
            <div id="picker-wrapper" className={colorStyles.pickerWrapper}>
              <div id="picker" className={colorStyles.picker}/>
              <div id="picker-indicator" className={colorStyles.pickerIndicator}/>
            </div>
            <div id="slider-wrapper" className={colorStyles.sliderWrapper}>
              <div id="slider" className={colorStyles.slider}/>
              <div id="slider-indicator" className={colorStyles.indicator}/>
            </div>
          </div>
        }
      </div>
    );
  }
}

export function ColorPlugin(tagName) {
  let shortCutKey = 'mod+w';
  return formatPlugin(BUTTONS.COLOR, shortCutKey);
}
