import Html from 'slate-html-serializer';
import { getEventTransfer } from 'slate-react';

import { BUTTONS } from '../constant';

const BLOCK_TAGS = {
  p: BUTTONS.PARAGRAPH,
  li: BUTTONS.LIST_ITEMS,
  ul: BUTTONS.UL_LIST,
  ol: BUTTONS.OL_LIST,
  blockquote: BUTTONS.BLOCK_QUOTE,
  pre: BUTTONS.CODE_BLOCK,
  code: BUTTONS.CODE,
  h1: BUTTONS.H1,
  h2: BUTTONS.H2,
  h3: BUTTONS.H3,
  h4: BUTTONS.H4,
  h5: BUTTONS.H5,
  h6: BUTTONS.H6
};

/**
 * Tags to marks.
 *
 * @type {Object}
 */

const MARK_TAGS = {
  strong: BUTTONS.BOLD,
  em: BUTTONS.ITALIC,
  u: BUTTONS.UNDERLINE,
  s: BUTTONS.STRIKE_THROUGH
};

const RULES = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (block) {
        console.log('serializing ==> ', block);
        return {
          object: 'block',
          type: block,
          nodes: next(el.childNodes)
        };
      }
    }
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()];

      if (mark) {
        return {
          object: 'mark',
          type: mark,
          nodes: next(el.childNodes)
        };
      }
    }
  },
  {
    // Special case for code blocks, which need to grab the nested childNodes.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'pre') {
        const code = el.childNodes[0];
        const childNodes =
          code && code.tagName.toLowerCase() === 'code' ?
            code.childNodes :
            el.childNodes;

        return {
          object: 'block',
          type: 'code',
          nodes: next(childNodes)
        };
      }
    }
  },
  {
    // Special case for images, to grab their src.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'img') {
        return {
          object: 'block',
          type: BUTTONS.IMAGE,
          nodes: next(el.childNodes),
          data: {
            src: el.getAttribute('src')
          }
        };
      }
    }
  },
  {
    // Special case for images, to grab their src.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'video') {
        return {
          object: 'block',
          type: BUTTONS.VIDEO,
          nodes: next(el.childNodes),
          data: {
            src: el.getAttribute('src')
          }
        };
      }
    }
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'a') {
        return {
          object: 'inline',
          type: BUTTONS.LINK,
          nodes: next(el.childNodes),
          data: {
            href: el.getAttribute('href')
          }
        };
      }
    }
  }
];

const serializer = new Html({ rules: RULES });

export function HtmlSerializer() {
  return {
    onPaste: (event, change, editor) => {
      const transfer = getEventTransfer(event);
      if (transfer.type !== 'html') return;
      const { document } = serializer.deserialize(transfer.html);
      console.log('pasted serialized document', transfer.html, document.toJSON());
      change.insertFragment(document);
      editor.onChange(change);
      return true;
    }
  };
}
