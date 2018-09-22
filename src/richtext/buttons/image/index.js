import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';
import { getEventTransfer, getEventRange } from 'slate-react';

import { BUTTONS } from '../../constant';
import { isUrl } from '../../util';

import Layout from './layout.json';
import styles from '../../editor.css';

export class ImageButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    activeClass: styles.active
  }

  constructor(props) {
    super(props);
  }

  onSelectImage = (fileUrl) => {
    console.log('choosed field url', fileUrl);
    if(fileUrl.length === 0) return;
    fileUrl = fileUrl[0].Key;
    let change = this.props.change.insertBlock({
      type: BUTTONS.IMAGE,
      isVoid: true,
      data: { src: fileUrl }
    }).insertBlock({
      type: BUTTONS.PARAGRAPH
    }).focus();
    this.props.onChange(change);
  }

  openFilePicker = () => {
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.icon} onClick={this.openFilePicker}>
          <Isvg src={require('./icons8-picture.svg')} cacheGetRequests={ true }/>
        </div>
      </React.Fragment>
    );
  }
}

export function ImagePlugin() {

  return {
    onDrop: (evt, change, editor) => {
      return;
      /*
      let transfer = getEventTransfer(evt);
      let range = getEventRange(evt, change.value);
      if (transfer.type !== "files") return;
      const { files } = transfer;

      for (const file of files) {
        const type = file.type;
        const [, ext] = type.split('/');
        if (!['png', 'jpeg', 'jpg'].includes(ext)) continue;

        if (range) {
          change.select(range);
        }
        let imgDataUrl = URL.createObjectURL(file);
        change.insertBlock({
          type: BUTTONS.IMAGE,
          isVoid: true,
          data: { src: imgDataUrl }
        }).insertBlock({
          type: BUTTONS.PARAGRAPH
        }).focus();
        editor.onChange(change);
      }
      return undefined;
      */
    },
    renderNode: (prop) => {
      console.log('rendering node ===> ', prop.node.type);
      const { node, attributes, isSelected, children } = prop;
      let url = node.data.get('src');
      if(isUrl(node.data.get('src'))) {
        url = node.data.get('src');
      }
      let align = node.data.get('align');
      let className = isSelected ? styles.selected : "";
      switch (node.type) {
      case BUTTONS.IMAGE:
        return (
          <div className={className} style={{ textAlign: align }} {...attributes}>
            <span className={styles.hide}>{children}</span>
            <img alt="" src={url} className={styles.image} />
          </div>
        );
      default:
        return undefined;
      }
    }
  };
}
