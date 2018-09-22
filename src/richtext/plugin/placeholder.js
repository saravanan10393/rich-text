import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'slate-react';
import Isvg from 'react-inlinesvg';

import { RelativePortal } from '../../portal/portal';
import { CodeButton } from '../buttons/code';
import { BlockQuote } from '../buttons/quote';
import { wrapInList } from '../buttons/list';
import { BUTTONS } from '../constant';

import styles from '../editor.css';

export function PlaceholderPlugin() {
  let hasFocus = false;
  let inlineRef = React.createRef();
  return {
    onKeyDown: (e) => {
      if(e.key === 'Escape' && inlineRef.current) {
        e.preventDefault();
        e.stopPropagation();
        inlineRef.current.closeMenu();
      }
    },
    onFocus: () => {
      hasFocus = true;
    },
    onBlur: () => {
      //hasFocus = false;
    },
    renderPortal: (value, editor) => {
      if(!hasFocus) return null;
      return <InlineHeader ref={inlineRef} value={value} editor={editor}/>;
    }
  };
}

class InlineHeader extends React.Component {
  static propTypes = {
    editor: PropTypes.object,
    value: PropTypes.object
  }

  state = {
    openMenu: false
  }

  listRef = React.createRef();

  icons = {
    [BUTTONS.PARAGRAPH]: <Isvg key="1" src={require('../buttons/heading/icons8-heading.svg')} cacheGetRequests={true}/>,
    [BUTTONS.OL_LIST]: <Isvg key="2" src={require('../buttons/list/icons8-ol_list.svg')} cacheGetRequests={true}/>,
    [BUTTONS.UL_LIST]: <Isvg key="3" src={require('../buttons/list/icons8-ul_list.svg')} cacheGetRequests={true}/>,
    [BUTTONS.CODE_BLOCK]: <Isvg key="4" src={require('../buttons/code/icons8-code.svg')} cacheGetRequests={true}/>,
    [BUTTONS.BLOCK_QUOTE]: <Isvg key="5" src={require('../buttons/quote/icons8-quote.svg')} cacheGetRequests={true}/>,
    [BUTTONS.H1]: <Isvg key="6" src={require('./images/icons8-header-1.svg')} cacheGetRequests={true}/>,
    [BUTTONS.H2]: <Isvg key="7" src={require('./images/icons8-header-2.svg')} cacheGetRequests={true}/>
  }

  onChange = (change) => {
    this.props.editor.onChange(change);
    this.closeMenu();
  };

  openMenu = () => {
    this.setState({
      openMenu: true
    });

    //doing setState again to calculate the menu position;
    requestAnimationFrame(() => {
      this.setState({});
    }, 200);
  }

  closeMenu = () => {
    this.setState({
      openMenu: false
    });
  }

  setHeading = (heading) => {
    let change = this.props.value.change();
    change.setBlocks({
      type: heading
    }).focus();
    this.closeMenu();
    this.props.editor.onChange(change);
  }

  setInList = (type) => {
    let change = this.props.value.change();
    this.closeMenu();
    this.props.editor.onChange(wrapInList(type, change));
  }

  getParent(node) {
    let parent = this.props.value.document.getParent(node.key);
    if(parent.object === 'document') {
      return node;
    }
    return this.getParent(parent);
  }

  render() {
    try {
      let blockNode = this.getParent(this.props.value.startBlock);
      let domNode = findDOMNode(blockNode);
      let rect = domNode.getBoundingClientRect();
      let iconLeft = [BUTTONS.OL_LIST, BUTTONS.UL_LIST].includes(blockNode.type) ? 35 : 20;
      const style = {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left - iconLeft}px`,
        zIndex: 9999
      };

      const change = this.props.value.change();

      let left = (() => {
        if(!this.listRef.current) return 0;
        return (this.listRef.current.offsetWidth / 2) - 10;
      })();

      let icon = this.icons[blockNode.type] || this.icons[BUTTONS.PARAGRAPH];
      console.log('node type', blockNode.type, icon);
      return (
        <div className={styles.placeholder} style={style} onMouseEnter={this.openMenu} onMouseLeave={this.closeMenu}>
          {
            icon
          }
          {
            this.state.openMenu &&
            // <RelativePortal top={-70} left={-left}>
            <ul style={{ left: `-${left}px` }}
              onMouseLeave={this.closeMenu}
              className={styles.inlineMenu} ref={this.listRef}>
              <li className={styles.menuIcon} onClick={() => this.setHeading(BUTTONS.H1)}>H1</li>
              <li className={styles.menuIcon} onClick={() => this.setHeading(BUTTONS.H2)}>H2</li>
              <li className={styles.menuIcon} onClick={() => this.setInList(BUTTONS.UL_LIST)}>
                <Isvg src={require('../buttons/list/icons8-ul_list.svg')} cacheGetRequests={true}/>
              </li>
              <li className={styles.menuIcon} onClick={() => this.setInList(BUTTONS.OL_LIST)}>
                <Isvg src={require('../buttons/list/icons8-ol_list.svg')} cacheGetRequests={true}/>
              </li>
              <li><CodeButton change={change} onChange={this.onChange}/></li>
              <li><BlockQuote change={change} onChange={this.onChange}/></li>
            </ul>
            // </RelativePortal>
          }
        </div>
      );
    }catch(err) {
      return null;
    }
  }
}
