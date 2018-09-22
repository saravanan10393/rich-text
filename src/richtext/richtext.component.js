import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import { Value } from 'slate';

import { Toolbar } from './toolbar';
import { BoldButton, BoldPlugin } from './buttons/bold';
import { ItalicButton, ItalicPlugin } from './buttons/italic';
import { UnderlineButton, UnderlinePlugin } from './buttons/underline';
import { StrikeButton, StrikePlugin } from './buttons/strike_through';
import { BlockQuote, BlockQuotePlugin } from './buttons/quote';
import { Alignment, AlignmentPlugin } from './buttons/alignment';
import { ColorButton, ColorPlugin } from './buttons/color';
import { Intent, IntentPlugin } from './buttons/intent';
import { Heading, HeadingPlugin } from './buttons/heading';
import { ImagePlugin, ImageButton } from './buttons/image';
import { ListButton, ListPlugin } from './buttons/list';
import { LinkButton, LinkPlugin } from './buttons/link';
import { renderNode } from './util';
import { InlineToolbar } from './inline_toolbar';
import { VideoButton, VideoPlugin } from './buttons/video';
import { EraseButton } from './buttons/erase';
import { ButtonBreak } from './buttons/break';
import { CodeButton, CodePlugin } from './buttons/code';

import { PlaceholderPlugin } from './plugin/placeholder';
import { InsertBlockOnEnterPlugin } from './plugin/insert.block';
import { SoftBreak } from './plugin/soft.break';
import { documentValidationPlugin } from './plugin/document.validation';
import { HtmlSerializer } from './plugin/html.deserializer';

import { BUTTONS, customBlocks } from './constant';

import styles from './editor.css';

const toolbarButtons = {
  bold: {
    button: BoldButton,
    plugin: BoldPlugin
  },
  italic: {
    button: ItalicButton,
    plugin: ItalicPlugin
  },
  underline: {
    button: UnderlineButton,
    plugin: UnderlinePlugin
  },
  strikeThrough: {
    button: StrikeButton,
    plugin: StrikePlugin
  },
  break: {
    button: ButtonBreak
  },
  erase: {
    button: EraseButton
  },
  quote: {
    button: BlockQuote,
    plugin: BlockQuotePlugin
  },
  align: {
    button: Alignment
  },
  intent: {
    button: Intent,
    plugin: IntentPlugin
  },
  image: {
    button: ImageButton,
    plugin: ImagePlugin
  },
  video: {
    button: VideoButton,
    plugin: VideoPlugin
  },
  link: {
    button: LinkButton,
    plugin: LinkPlugin
  },
  color: {
    button: ColorButton,
    plugin: ColorPlugin
  },
  list: {
    button: ListButton,
    plugin: ListPlugin
  },
  code: {
    button: CodeButton,
    plugin: CodePlugin
  },
  heading: {
    button: Heading,
    plugin: HeadingPlugin
  },
  placeholder: {
    plugin: PlaceholderPlugin
  }
};

const json = {
  object: "value",
  document: {
    object: "document",
    nodes: [
      {
        object: "block",
        type: "paragraph",
        data: {},
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: ""
              }
            ]
          }
        ]
      }
    ]
  }
};

export class RichTextEditor extends React.Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string),
    customButton: PropTypes.arrayOf(PropTypes.shape({
      button: PropTypes.object,
      plugin: PropTypes.func
    })),
    hasToolbar: PropTypes.bool,
    hasInlineToolbar: PropTypes.bool,
    className: PropTypes.string,
    value: PropTypes.string,
    handleChange: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    key: PropTypes.string,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool
  }

  static defaultProps = {
    buttons: [
      'bold', 'italic', 'underline', 'strikeThrough', 'color', 'erase', 'break',
      'align', 'heading', 'link', 'break',
      'list', 'quote', 'image', 'video', 'placeholder'
    ],
    hasToolbar: true,
    hasInlineToolbar: true,
    customButton: [],
    className: '',
    autoFocus: true,
    placeholder: "Start typing here",
    readOnly: false,
    onFocus: () => {},
    onChange: () => {},
    handleChange: () => {}
  };

  constructor(props) {
    super(props);
    let value = this.props.value || json;
    this.state = {
      value: Value.fromJSON(value)
    };
    this.toolbarButtons = [];
    this.plugins = [
      documentValidationPlugin(),
      InsertBlockOnEnterPlugin(BUTTONS.PARAGRAPH),
      SoftBreak(),
      HtmlSerializer()
    ];
    this.props.buttons.forEach((button) => { this.addButton(toolbarButtons[button] || {}); });
    this.props.customButton.forEach(this.addButton);
  }

  componentWillReceiveProps(newProps) {
    let value = newProps.value || json;
    newProps.customButton.forEach(this.addButton);
    //newProps.buttons.forEach((button) => { this.addButton(toolbarButtons[button] || {}); });
    this.setState({
      value: Value.fromJSON(value)
    });
  }

  addButton = (buttonConfig) => {
    if(buttonConfig.button) {
      this.toolbarButtons.push(buttonConfig.button);
    }
    if(buttonConfig.plugin) {
      this.plugins.unshift(buttonConfig.plugin());
    }
  };

  insertImoji(emoji) {
    let change = this.state.value.change();
    change
      .insertText(emoji)
      .focus();
    this.onChange(change);
  }

  addExternalBlock(type, data = {}) {
    let change = this.state.value.change();
    change
      .insertBlock({
        isVoid: true,
        type: type,
        data
      })
      .insertBlock(BUTTONS.PARAGRAPH)
      .focus();
    this.onChange(change);
  }

  isEmpty() {
    let excludeBlokcs = [BUTTONS.PARAGRAPH];
    let isEmpty = true;
    for(let node of this.state.value.document.nodes) {
      if(!excludeBlokcs.includes(node.type)) isEmpty = false;
      else if(node.text.trim().length) isEmpty = false;
    }
    return isEmpty;
  }

  onChange = (change) => {
    this.setState({
      value: change.value
    });
    this.props.onChange(change.value.toJSON());
  }

  onBlur = (change) => {
    let slateJson = this.state.value.toJSON();
    this.props.handleChange(slateJson);
  }

  onFocus = () => {
    this.props.onFocus();
  }

  render() {
    return (
      <div className={styles.editorContainer}>
        {
          this.props.hasToolbar &&
          <Toolbar value={this.state.value} options={this.toolbarButtons} onChange={this.onChange} />
        }
        {
          this.props.hasInlineToolbar &&
          <InlineToolbar value={this.state.value} onChange={this.onChange} />
        }
        <Editor value={this.state.value}
          key={this.props.key}
          className={`${this.props.className} ${styles.richTextEditor}`}
          onChange={this.onChange}
          plugins={this.plugins}
          onBlur={this.onBlur}
          placeholder={this.props.placeholder}
          onFocus={this.onFocus}
          autoFocus={this.props.autoFocus}
          readOnly={this.props.readOnly}
          renderNode={renderNode}
          spellCheck={true}/>
      </div>
    );
  }
}

