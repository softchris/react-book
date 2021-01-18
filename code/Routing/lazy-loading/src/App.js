import React, { Component } from 'react';

import Main from './Main';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
         <div>Header</div>
        <Main />
      </div>
    );
  }
}

export default App;
