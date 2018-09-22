import React, { Component } from 'react';
import styles from './App.css';

import { RichTextEditor } from './richtext/richtext.component';

class App extends Component {

  render() {
    return (
      <div className={styles.feedContainer}>
          <RichTextEditor className={styles.editor} hasToolbar={true} hasInlineToolbar={true}/>
      </div>
    );
  }
}

export default App;
