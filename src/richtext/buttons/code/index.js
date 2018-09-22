import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';
import EditCode from 'slate-edit-code';

import { haveMark } from '../../util';

import { BUTTONS } from '../../constant';

import styles from '../../editor.css';

const codePlugin = EditCode();

export class CodeButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  toggleCode = (type, e) => {
    //e.preventDefault();
    let change = codePlugin.changes.toggleCodeBlock(this.props.change, BUTTONS.PARAGRAPH).focus();
    this.props.onChange(change);
  }

  render() {
    let isActive = classSet({ [this.props.activeClass]: codePlugin.utils.isInCodeBlock(this.props.change.value) });
    return (
      <div className={`${styles.icon} ${isActive}`} onClick={this.toggleCode}>
        <Isvg src={require('./icons8-code.svg')} cacheGetRequests={ true }/>
      </div>
    );
  }
}

export function CodePlugin(tagName) {
  return {
    ...codePlugin,
    renderNode: (prop) => {
      const { node, children, attributes } = prop;
      switch(node.type) {
      case BUTTONS.CODE_BLOCK:
        return (
          <div style={{ background: "#ddd" }} {...attributes}>
            {children}
          </div>
        );
      case BUTTONS.CODE_LINE:
        return <pre {...attributes}>{children}</pre>;
      default:
        return undefined;
      }
    }
  };
}
