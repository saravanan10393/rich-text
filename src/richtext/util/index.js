import React from 'react';
import isHotKey from 'is-hotkey';
import { Block } from 'slate';

import { BUTTONS, customBlocks } from '../constant';

export function haveMark(type, change) {
  return change.value ? change.value.activeMarks.find((mark) => mark.type === type) : false;
}

export function formatPlugin(formatType, hotKey, tagName) {
  return {
    onKeyDown: (event, change, editor) => {
      if (isHotKey(hotKey, event)) {
        event.preventDefault();
        change.toggleMark(formatType);
        return true;
      }
    },
    renderMark: (prop) => {
      const { children, mark, attributes } = prop;
      console.log(`${mark.type} mark is calling`);
      switch (mark.type) {
      case BUTTONS.BOLD:
        return <strong {...attributes}>{children}</strong>;
      case BUTTONS.ITALIC:
        return <em {...attributes}>{children}</em>;
      case BUTTONS.CODE:
        return <code {...attributes}>{children}</code>;
      case BUTTONS.UNDERLINE:
        return <u {...attributes}>{children}</u>;
      case BUTTONS.STRIKE_THROUGH:
        return <strike {...attributes}>{children}</strike>;
      case BUTTONS.COLOR:
        let color = mark.data.get('color');
        return <span style={{ color }} { ...attributes }>{children}</span>;
      default:
        return undefined;
      }
    }
  };
}

export function renderNode(prop) {
  const { children, node, attributes, editor, isSelected } = prop;
  console.log(`======> rendering node ${node.type} ans isSelected ${isSelected}`);
  let textAlign = node.data.get('align') || 'left';
  let textIndent = node.data.get('intent');
  let style = {
    textAlign,
    textIndent
  };
  switch (node.type) {
  case BUTTONS.H1:
    return <h1 style={style} {...attributes}>{children}</h1>;
  case BUTTONS.H2:
    return <h2 style={style} {...attributes}>{children}</h2>;
  case BUTTONS.H3:
    return <h3 style={style} {...attributes}>{children}</h3>;
  case BUTTONS.H4:
    return <h4 style={style} {...attributes}>{children}</h4>;
  case BUTTONS.H5:
    return <h5 style={style} {...attributes}>{children}</h5>;
  case BUTTONS.H6:
    return <h6 style={style} {...attributes}>{children}</h6>;
  case BUTTONS.PARAGRAPH:
    return <div style={style} {...attributes}>{children}</div>;
  default:
    return undefined;
  }
}

export const getVisibleSelectionRect = () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if(range.collapsed) {
    return null;
  }
  const boundingRect = range.getBoundingClientRect();
  const { top, right, bottom, left } = boundingRect;

  if (top === 0 && right === 0 && bottom === 0 && left === 0) {
    return null;
  }

  return boundingRect;
};

export function isUrl(string) {
  if (typeof string !== 'string') {
    return false;
  }

  return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(string);
}

export const getCurrentBlockByType = (change, type) => {
  let { value } = change;
  let { document } = value;
  if (!value.selection.startKey) return null;
  let block = value.startBlock;
  const parent = document.getParent(block.key);
  return parent.type === type ? parent : null;
};

export function parseQueryString(queryString) {
  var assoc = {};
  var keyValues = (queryString || window.location.search).slice(1).split('&');
  var decode = function(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  };

  for (var i = 0; i < keyValues.length; ++i) {
    var key = keyValues[i].split('=');
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  }

  return assoc;
}