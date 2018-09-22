import { Block } from 'slate';
/**
 * Add the block element of args on every enter
 * @param {*} args
 * @returns {object} slate plugin object
 */
export function InsertBlockOnEnterPlugin(...args) {
  const blockArg = args[0];
  let blockInputProps;
  let defaultProps = { object: 'block' };

  if (!blockArg) {
    throw new Error('You must pass a block type (string) or object for the block to insert.');
  }
  if (args[0].constructor.name === 'String') {
    blockInputProps = Object.assign({}, defaultProps, { type: blockArg });
  } else {
    blockInputProps = Object.assign(
      {},
      defaultProps,
      blockArg
    );
  }

  function onKeyDown(e, change) {
    const { value } = change;
    if (e.key === 'Enter' && e.shiftKey === false) {
      const { document, startKey, endKey, startBlock } = value;
      if (startBlock && startKey === endKey) {
        const nextBlock = document.getNextBlock(startKey);
        const prevBlock = document.getPreviousBlock(startKey);
        const blockToInsert = Block.create(blockInputProps);
        //disable adding new block when the cursor is in the middle of text row
        if(value.endOffset !== value.endText.text.length) {
          return;
        }
        // Void block at the end of the document
        if (!nextBlock) {
          return change
            .collapseToEndOf(startBlock)
            .insertBlock(blockToInsert)
            .collapseToEnd();
        }
        // Void block between two blocks
        if (nextBlock && prevBlock) {
          return change
            .collapseToEndOf(startBlock)
            .insertBlock(blockToInsert);
        }
        // Void block in the beginning of the document
        if (nextBlock && !prevBlock) {
          return change
            .collapseToStartOf(startBlock)
            .insertNodeByKey(document.key, 0, blockToInsert);
        }
      }
    }
  }

  return {
    onKeyDown
  };
}
