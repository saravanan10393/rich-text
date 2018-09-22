import React from 'react';
import PropTypes from 'prop-types';
import classSet from 'react-classset';
import Isvg from 'react-inlinesvg';

import styles from '../../editor.css';
import alignStyles from './align.css';

export class Alignment extends React.Component {
  static propTypes = {
    activeClass: PropTypes.string,
    change: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    activeClass: styles.active
  }

  componentWillReceiveProps() {
    this.closeList();
  }

  state = {
    isOpen: false,
    align: 'left'
  }

  haveAlignment(change, alignType = 'Left') {
    return ((change.value.blocks.first() && change.value.blocks.first().data.get('align')) || 'Left') === alignType;
  }

  toggleAlign(alignType, e) {
    let data = this.props.change.value.startBlock.data;
    this.setState({
      align: alignType.toLowerCase()
    });
    this.props.change.setBlocks({
      // type: BUTTONS.ALIGNMENT,
      data: data.set('align', alignType)
    }).focus();
    this.props.onChange(this.props.change);
  }

  openList = () => {
    this.setState({
      isOpen: true
    });
  }

  closeList = () => {
    this.setState({
      isOpen: false
    });
  }

  render() {
    let isActive = (type) => classSet({ [alignStyles.active]: this.haveAlignment(this.props.change, type) });
    return (
      <div className={alignStyles.alignContainer}>
        <div key={this.state.align} className={`${styles.icon} ${isActive('Left')}`} onClick={this.openList}>
          <Isvg src={require(`./icons8-align-${this.state.align}.svg`)} cacheGetRequests={ true }/>
        </div>
        {/* <div className={`${styles.icon} ${isActive('Center')}`} onClick={(e) => this.toggleAlign('Center', e)}>
          <Isvg src={require('./icons8-align-center.svg')} cacheGetRequests={ true }/>
        </div>
        <div className={`${styles.icon} ${isActive('Right')}`} onClick={(e) => this.toggleAlign('Right', e)}>
          <Isvg src={require('./icons8-align-right.svg')} cacheGetRequests={ true }/>
        </div> */}
        {
          this.state.isOpen &&
          <ul className={alignStyles.alignList}>
            <li onClick={(e) => this.toggleAlign('Left', e)}>
              <Isvg src={require('./icons8-align-left.svg')} cacheGetRequests={ true }/>
            </li>
            <li onClick={(e) => this.toggleAlign('Center', e)}>
              <Isvg src={require('./icons8-align-center.svg')} cacheGetRequests={ true }/>
            </li>
            <li onClick={(e) => this.toggleAlign('Right', e)}>
              <Isvg src={require('./icons8-align-right.svg')} cacheGetRequests={ true }/>
            </li>
          </ul>
        }
      </div>
    );
  }
}

// export function AlignmentPlugin(tagName) {
//   return {
//     renderNode: (props) => {
//       const { children, node, style, attributes } = props
//       let align = node.data.get('align') || 'left';
//       console.log('set align', node.data.get('align'), style);
//       switch(node.type) {
//         case BUTTONS.ALIGNMENT:
//           return <div style={{textAlign: align, ...style}} {...attributes }>{children}</div>
//       }
//     }
//   }
// }
