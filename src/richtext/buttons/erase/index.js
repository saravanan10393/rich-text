import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import styles from '../../editor.css';

export class EraseButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  removeAllMark = (e) => {
    e.preventDefault();
    let change = this.props.change;
    for(let mark of this.props.change.value.activeMarks.values()) {
      change = this.props.change.removeMark(mark).focus();
    }
    this.props.onChange(change);
  }

  render() {
    return (
      <div className={`${styles.icon}`} onClick={this.removeAllMark}>
        <Isvg src={require('./icons8-erase.svg')} cacheGetRequests={ true }/>
      </div>
    );
  }
}
