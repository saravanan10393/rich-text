import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import { getEventTransfer } from 'slate-react';
import Isvg from 'react-inlinesvg';

import { isUrl } from '../../util';
import { BUTTONS } from '../../constant';

import styles from '../../editor.css';
import linkStyles from './link.css';

const hasLink = (value) => {
  return value.inlines.find(link => link.type === BUTTONS.LINK);
};

const wrapLink = (change, data) => {
  return change.wrapInline({
    type: BUTTONS.LINK,
    data: data
  });
};

const unwrapLink = (change, data) => {
  return change.unwrapInline({
    type: BUTTONS.LINK,
    data: data
  });
};

function toggleLink(e) {
  let { change } = this.props;
  let link = hasLink(change.value);
  if(link && !e.target.value) {
    let data = link.data;
    change = unwrapLink(change, data.delete('href'));
  }else{
    let url = e.target.value;

    if (!isUrl(url)) return;

    let linkText = this.state.linkText || url;
    if(change.value.isCollapsed) {
      const { startOffset } = change.value;
      change = change.insertText(linkText).moveOffsetsTo(startOffset, startOffset + linkText.length);
    }
    change = wrapLink(change, { href: url, text: linkText }).collapseToEnd().focus();
  }
  this.props.onChange(change);
}

export class InlineLinkButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  constructor(props) {
    super(props);

    this.state = {
      promptLink: false
    };
    this.toggleLink = toggleLink.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      promptLink: false
    });
  }

  promptLink = () => {
    this.setState({
      promptLink: true
    });
  }

  closeLinkPrompt = () => {
    this.setState({
      promptLink: false
    });
  }

  //listen for enter key press and save as link
  onKeyDown = (e) => {
    let ENTER_KEY = 13;
    if(e.keyCode === ENTER_KEY) {
      e.preventDefault();
      this.toggleLink(e);
      //this.closeLinkPrompt();
    }
  }
  render() {
    let link = hasLink(this.props.change.value);
    let value = link && link.data.get('href');
    let isActive = classSet({ [this.props.activeClass]: link });
    return (
      <React.Fragment>
        <div className={`${styles.icon} ${isActive}`} onClick={this.promptLink}>
          <Isvg src={require('./icons8-link.svg')} cacheGetRequests={ true }/>
        </div>
        {
          this.state.promptLink &&
          <div className={linkStyles.linkBox}>
            <input type="text" autoFocus={true}
              onBlur={this.toggleLink}
              defaultValue={value}
              onKeyDown={this.onKeyDown}
              placeholder="Paste link here..."/>
            <p onClick={this.closeLinkPrompt}>
              <Isvg src={require('./icons8-cross-mark.svg')} cacheGetRequests={ true }/>
            </p>
          </div>
        }
      </React.Fragment>
    );
  }
}

export class LinkButton extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  constructor(props) {
    super(props);
    this.state = {
      promptLink: false
    };
    this.toggleLink = toggleLink.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      promptLink: false
    });
  }

  updateName = (evt) => {
    this.setState({
      linkText: evt.target.value
    });
  }

  promptLink = () => {
    this.setState({
      promptLink: !this.state.promptLink
    });
  }

  closeLinkPrompt = () => {
    this.setState({
      promptLink: false
    });
  }

  //listen for enter key press and save as link
  onKeyDown = (e) => {
    let ENTER_KEY = 13;
    if(e.keyCode === ENTER_KEY) {
      this.toggleLink(e);
      this.closeLinkPrompt();
    }
  }

  render() {
    let isActive = classSet({ [this.props.activeClass]: hasLink(this.props.change.value) });
    return (
      <div className={linkStyles.linkContainer}>
        <div className={`${styles.icon} ${isActive}`} onClick={this.promptLink}>
          <Isvg src={require('./icons8-link.svg')} cacheGetRequests={ true }/>
        </div>
        {
          this.state.promptLink &&
          <div className={linkStyles.linkForm}>
            <input type="text" autoFocus={true}
              onBlur={this.updateName}
              placeholder="Link text"/>
            <input type="text"
              onBlur={this.toggleLink}
              onKeyDown={this.onKeyDown}
              placeholder="Paste link here..."/>
          </div>
        }
      </div>
    );
  }
}

export function LinkPlugin() {
  return {
    onPaste(event, change) {
      const transfer = getEventTransfer(event);
      const { value } = change;
      const { text } = transfer;
      if (transfer.type !== 'text' && transfer.type !== 'html') return;
      if (!isUrl(text)) return;

      if (value.isCollapsed) {
        const { startOffset } = value;
        change.insertText(text).moveOffsetsTo(startOffset, startOffset + text.length);
      } else if (hasLink(value)) {
        change['call'](unwrapLink);
      }

      change['call'](wrapLink, { href: text });

      return change;
    },
    renderNode: (prop) => {
      const { node, attributes, children } = prop;
      const href = node.data.get('href');
      switch(node.type) {
      case BUTTONS.LINK:
        return <a href={href} {...attributes} target="_blank">{children}</a>;
      default:
        return;
      }
    }
  };
}
