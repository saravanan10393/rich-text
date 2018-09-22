import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import { BUTTONS } from '../../constant';

import styles from '../../editor.css';

const hasIntent = (change) => {
  let { value } = change;
  if (!value.selection.startKey) return null;
  return value.startBlock.data.get('intent');
};

export class Intent extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  intentIn = () => {
    let data = this.props.change.value.startBlock.data;
    this.props.change.setBlocks({
      //type: BUTTONS.PARAGRAPH,
      data: data.set('intent', '40px')
    }).focus();
    this.props.onChange(this.props.change);
  }

  intentOut = () => {
    let startBlock = this.props.change.value.startBlock;
    if (startBlock.data.get('intent')) {
      this.props.change.setBlocks({
        //type: BUTTONS.PARAGRAPH,
        data: startBlock.data.delete('intent')
      }).focus();
    }
    this.props.onChange(this.props.change);
  }

  render() {
    let onClick = (e) => this.toggleIntent(BUTTONS.INTENT, e);
    //let isActive = classSet({ [this.props.activeClass]: hasIntent(this.props.change) });
    return (
      <React.Fragment>
        <div className={`${styles.icon} ${styles.inverseIcon}`} onClick={this.intentIn}>
          <Isvg src={require('./icons8-indent.svg')} cacheGetRequests={ true }/>
        </div>
        <div className={styles.icon} onClick={this.intentOut}>
          <Isvg src={require('./icons8-indent.svg')} cacheGetRequests={ true }/>
        </div>
      </React.Fragment>
    );
  }
}

export function IntentPlugin() {
  return {
    onKeyDown: (evt, change) => {
      if (evt.key !== 'Backspace' || evt.key !== 'Delete') return undefined;
      const { value } = change;
      const { startOffset, isCollapsed } = value;

      if (!hasIntent(change) || !isCollapsed) {
        return undefined;
      }

      if (startOffset !== 0) {
        return undefined;
      }

      // Block is empty, reset the intent
      evt.preventDefault();
      if (value.startBlock.data.get('intent')) {
        return change.setBlocks({
          data: value.startBlock.data.delete('intent')
        });
      }
      console.log('intent key down');
      return undefined;
    },
    renderNode: (prop) => {
      const { children, node, attributes } = prop;
      let intent = node.data.get('intent');
      console.log('intent data', intent, node.type);
      switch (node.type) {
      case BUTTONS.PARAGRAPH:
        return <div style={{ textIndent: intent }} {...attributes}>{children}</div>;
      default:
        return undefined;
      }
    }
  };
}
