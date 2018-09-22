import { Block } from 'slate';

import { BUTTONS, customBlocks } from '../constant';

export function documentValidationPlugin() {
  let blockNodes = [
    BUTTONS.PARAGRAPH,
    BUTTONS.H1,
    BUTTONS.H2,
    BUTTONS.H3,
    BUTTONS.H4,
    BUTTONS.H5,
    BUTTONS.BLOCK_QUOTE,
    BUTTONS.OL_LIST,
    BUTTONS.UL_LIST,
    BUTTONS.IMAGE,
    BUTTONS.VIDEO,
    customBlocks.POLL,
    customBlocks.COLLAGE,
    customBlocks.EMBED_LINK,
    customBlocks.ANNOUNCEMENT
  ];
  return {
    schema: {
      document: {
        nodes: [
          { types: blockNodes, min: 1 }
        ],
        normalize: (change, violation, context) => {
          console.log('document normalization called', violation, context);
          switch (violation) {
          case 'child_object_invalid':
            change.wrapBlockByKey(context.child.key, BUTTONS.PARAGRAPH);
            return;
          case 'child_type_invalid':
            change.setNodeByKey(context.child.key, BUTTONS.PARAGRAPH);
            return;
          case 'child_required':
            let block = Block.create({
              type: BUTTONS.PARAGRAPH
            });
            change.insertNodeByKey(context.node.key, 0, block).focus();
            return change;
          default:
            return;
          }
        }
      }
    }
  };
}
