import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';

import { getCurrentBlockByType } from '../../util';

import { BUTTONS } from '../../constant';

import styles from '../../editor.css';

export class BlockQuote extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  toggleQuote(type, e) {
    let blockQuote = getCurrentBlockByType(this.props.change, type);
    if(!blockQuote) {
      this.props.change.wrapBlock(type).focus();
    }else {
      this.props.change.unwrapBlock(type).focus();
    }
    this.props.onChange(this.props.change);
  }

  render() {
    let onClick = (e) => this.toggleQuote(BUTTONS.BLOCK_QUOTE, e);
    let isActive = classSet({ [this.props.activeClass]: getCurrentBlockByType(this.props.change, BUTTONS.BLOCK_QUOTE) });
    return (
      <div className={`${styles.icon} ${isActive}`} onClick={onClick}>
        <Isvg src={require('./icons8-quote.svg')} cacheGetRequests={ true }/>
      </div>
    );
  }
}

export function BlockQuotePlugin(tagName) {
  return {
    onKeyDown: (evt, change) => {
      if(evt.key !== 'Backspace' && evt.key !== 'Enter') return undefined;
      const { value } = change;
      const { startOffset, isCollapsed } = value;

      if (!getCurrentBlockByType(change, BUTTONS.BLOCK_QUOTE) || !isCollapsed) {
        return undefined;
      }

      if (startOffset !== 0) {
        return undefined;
      }

      // Block is empty, we exit the blockquote
      evt.preventDefault();

      return change.unwrapBlock(BUTTONS.BLOCK_QUOTE);
    },
    renderNode: (prop) => {
      const { children, node, attributes } = prop;
      const style = {
        borderLeft: "5px solid #ddd",
        paddingLeft: "20px",
        fontSize: "20px"
      };
      switch(node.type) {
      case BUTTONS.BLOCK_QUOTE:
        return <blockquote {...attributes } style={style}>{children}</blockquote>;
      default:
        return;
      }
    }
  };
}
