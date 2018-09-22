import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import SlateListPlugin from 'slate-edit-list';
import Isvg from 'react-inlinesvg';

import { BUTTONS } from '../../constant';
import styles from '../../editor.css';
import listStyles from './list.css';

let slatePlugin = SlateListPlugin({ types: ["ol_list", "ul_list"] });


export function wrapInList(type, change) {
  const { wrapInList, unwrapList } = slatePlugin.changes;
  const inList = slatePlugin.utils.isSelectionInList(change.value);
  if(inList) {
    let listBlock = slatePlugin.utils.getCurrentList(change.value);
    change['call'](unwrapList, listBlock.type).focus();
    if(listBlock.type !== type) {
      change['call'](wrapInList, type, {
        listStyle: type === BUTTONS.UL_LIST ? 'initial' : 'decimal'
      }).focus();
    }
  }else{
    change['call'](wrapInList, type, {
      listStyle: type === BUTTONS.UL_LIST ? 'initial' : 'decimal'
    }).focus();
  }
  return change;
}

export class ListButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  componentWillReceiveProps() {
    this.setState({
      isOpen: false
    });
  }

  state = {
    isOpen: false,
    listType: BUTTONS.UL_LIST
  }

  openList = () => {
    this.setState({
      isOpen: true
    });
  }

  wrapInList(type, e) {
    let change = wrapInList(type, this.props.change);
    this.setState({ listType: type });
    this.props.onChange(change);
  }

  render() {
    return (
      <div className={listStyles.listContainer}>
        <div className={`${styles.icon}`} onClick={this.openList}>
          <Isvg key={this.state.listType} src={require(`./icons8-${this.state.listType}.svg`)}
            cacheGetRequests={ true }/>
        </div>
        {
          this.state.isOpen &&
          <ul className={listStyles.listList}>
            <li onClick={(e) => this.wrapInList(BUTTONS.UL_LIST, e)}>
              <Isvg src={require('./icons8-ul_list.svg')} cacheGetRequests={ true }/></li>
            <li onClick={(e) => this.wrapInList(BUTTONS.OL_LIST, e)}>
              <Isvg src={require('./icons8-ol_list.svg')} cacheGetRequests={ true }/></li>
          </ul>
        }
      </div>
    );
  }
}

export function ListPlugin() {
  let renderNode = (prop) => {
    const { node, attributes, children, editor } = prop;
    const isCurrentItem = slatePlugin.utils
      .getItemsAtRange(editor.value)
      .contains(node);

    let listStyle = node.data.get('listStyle');
    switch (node.type) {
    case BUTTONS.UL_LIST:
      return <ul style={{ listStyleType: listStyle, marginLeft: '15px' }} {...attributes}>{children}</ul>;
    case BUTTONS.OL_LIST:
      return <ol style={{ listStyleType: listStyle, marginLeft: '15px' }} {...attributes}>{children}</ol>;
    case BUTTONS.LIST_ITEMS:
      return (
        <li
          {...attributes}
        >
          {children}
        </li>
      );
    default:
      return undefined;
    }
  };

  return Object.assign({}, slatePlugin, {
    renderNode
  });
}

