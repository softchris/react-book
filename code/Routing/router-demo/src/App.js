import React, { Component } from 'react';
import Main from './Main';
import Head from './Head';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Head />
        <Main />
      </React.Fragment>
    );
  }
}

export default App;
