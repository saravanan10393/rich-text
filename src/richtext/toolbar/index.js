import React from 'react';
import PropTypes from 'prop-types';

import styles from './toolbar.css';

export class Toolbar extends React.Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.func),
    value: PropTypes.object,
    onChange: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    value: PropTypes.object,
    className: ''
  }

  key = Math.random();

  renderIcon(Button) {
    return (<Button key={`${Button.name}-${this.key}`} value={this.props.value}
      change={this.props.value.change()} onChange={this.props.onChange} />);
  }

  render() {
    let className = `${this.props.className} ${styles.toolbar}`;
    return (
      <div className={className}>
        {
          this.props.options.map(Button => this.renderIcon(Button))
        }
      </div>
    );
  }
}
