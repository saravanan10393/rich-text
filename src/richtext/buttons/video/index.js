import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';

import { isUrl, getCurrentBlockByType } from '../../util';
import { parseQueryString } from '../../util';
import { BUTTONS } from '../../constant';

import styles from '../../editor.css';
import videoStyles from './video.css';

export class VideoButton extends React.Component {
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
      promptUrl: false
    });
  }

  state = {
    promptUrl: false
  }

  addVideo(url) {
    if(!isUrl(url)) return;
    let change = this.props.change.insertBlock({
      type: BUTTONS.VIDEO,
      isVoid: true,
      data: {
        url
      }
    }).focus()
      .insertBlock(BUTTONS.PARAGRAPH);
    this.props.onChange(change);
  }

  toggleLinkPrompt = () => {
    this.setState({
      promptUrl: !this.state.promptUrl
    });
  };

  onKeyDown = (e) => {
    let ENTER_KEY = 13;
    let ESC_KEY = 27;
    if(e.keyCode === ESC_KEY) {
      this.toggleLinkPrompt();
    }
    if(e.keyCode === ENTER_KEY) {
      this.addVideo(e.target.value);
      this.toggleLinkPrompt();
    }
  }

  render() {
    return (
      <div className={videoStyles.videoButton}>
        <div className={`${styles.icon}`} onClick={this.toggleLinkPrompt}>
          <Isvg src={require('./icons8-video.svg')} cacheGetRequests={ true }/>
        </div>
        {
          this.state.promptUrl &&
          <div className={videoStyles.videoBox} onClick={(e) => e.stopPropagation()}>
            <input type="text" autoFocus={true} placeholder="Paster video url" onKeyDown={this.onKeyDown}/>
          </div>
        }
      </div>
    );
  }
}

export function VideoPlugin() {
  return {
    onKeyDown: (evt, change) => {
      if(evt.key !== 'Backspace') return undefined;
      const { value } = change;
      const { startOffset, isCollapsed } = value;

      if (!getCurrentBlockByType(change, BUTTONS.VIDEO) || !isCollapsed) {
        return undefined;
      }

      if (startOffset !== 0) {
        return undefined;
      }

      // Block is empty, we exit the blockquote
      evt.preventDefault();

      return change.unWrapBlock({
        type: BUTTONS.PARAGRAPH
      }).delete();
    },
    renderNode: (prop) => {
      switch(prop.node.type) {
      case BUTTONS.VIDEO:
        return <Video {...prop}/>;
      default:
        return undefined;
      }
    }
  };
}

class Video extends React.Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    node: PropTypes.object,
    attributes: PropTypes.object,
    children: PropTypes.any
  }

  getProviderUrl = (url) => {
    if(url.match(/https:\/\/([a-z]*\.)?youtube.com/)) {
      let queryObj = parseQueryString(`?${url.split('?')[1]}`);
      let videoId = queryObj.v;
      url = `https://www.youtube.com/embed/${videoId}?wmode=opaque`;
    } else if(url.match(/https:\/\/([a-z]*\.)?dailymotion.com/)) {
      let videoId = url.split('/').pop();
      url = `https://www.dailymotion.com/embed/video/${videoId}`;
    } else if(url.match(/https:\/\/([a-z]*\.)?vimeo.com/)) {
      let videoId = url.split('/').pop();
      url = `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  };

  render() {
    let { isSelected, node, attributes, children } = this.props;
    console.log('rendering video alignment', node.data.get('align'));
    let videoUrl = this.getProviderUrl(node.data.get('url'));
    let align = node.data.get('align');
    let className = classSet({
      [styles.selected]: isSelected
    });
    return(
      <div style={{ textAlign: align }} {...attributes} className={className}>
        <iframe title="test url" src={videoUrl} width="640" height="360" allowFullScreen frameBorder={0} />
        <span>{children}</span>
      </div>
    );
  }
}
