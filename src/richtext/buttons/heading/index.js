import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import { BUTTONS } from '../../constant';

import styles from '../../editor.css';
import headStyles from './heading.css';

export class Heading extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  componentWillReceiveProps() {
    console.log('block type', this.props.change.value.blocks.first());
    let block = this.props.change.value.blocks.first();
    this.setState({
      heading: block ? block.type : BUTTONS.PARAGRAPH,
      isOpen: false
    });
  }

  state = {
    heading: BUTTONS.PARAGRAPH,
    isOpen: false
  }

  openList = () => {
    this.setState({
      isOpen: true
    });
  }

  setHeading = (heading) => {
    this.props.change.setBlocks({
      type: heading
    }).focus();
    this.props.onChange(this.props.change);
    this.setState({ heading, isOpen: false });
  }

  render() {
    return (
      <div className={headStyles.headingContainer}>
        <div className={`${styles.icon}`} onClick={this.openList}>
          <Isvg src={require('./icons8-heading.svg')} cacheGetRequests={ true }/>
        </div>
        {
          this.state.isOpen &&
          <ul className={headStyles.headingList}>
            <li onClick={() => this.setHeading(BUTTONS.PARAGRAPH)}>Normal</li>
            <li onClick={() => this.setHeading(BUTTONS.H1)}><h1>Heading 1</h1></li>
            <li onClick={() => this.setHeading(BUTTONS.H2)}><h2>Heading 2</h2></li>
            <li onClick={() => this.setHeading(BUTTONS.H3)}><h3>Heading 3</h3></li>
            <li onClick={() => this.setHeading(BUTTONS.H4)}><h4>Heading 4</h4></li>
            <li onClick={() => this.setHeading(BUTTONS.H5)}><h5>Heading 5</h5></li>
          </ul>
        }
      </div>
      // <select value={this.state.heading} onChange={this.setHeading}>
      //   {
      //     headings.map((h) => {
      //       return <option value={h} key={h}>{h}</option>;
      //     })
      //   }
      //   <option value={BUTTONS.PARAGRAPH} key={BUTTONS.PARAGRAPH}>Default</option>
      // </select>
    );
  }
}

export function HeadingPlugin() {
  let headings = [
    BUTTONS.H1,
    BUTTONS.H2,
    BUTTONS.H3,
    BUTTONS.H4,
    BUTTONS.H5
  ];

  return {
    onKeyDown: (evt, change) => {
      if(evt.key !== 'Backspace') return undefined;
      const { value } = change;
      const { startOffset, isCollapsed, startBlock } = value;

      if (!isCollapsed) {
        return undefined;
      }

      if (startOffset !== 0) {
        return undefined;
      }

      if(!headings.includes(startBlock.type)) return undefined;

      // Block is empty, reset the intent
      evt.preventDefault();
      return change.setBlocks({
        type: BUTTONS.PARAGRAPH,
        data: {}
      });
    }
  };
}
