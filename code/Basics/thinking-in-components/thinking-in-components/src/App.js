import React, { Component } from 'react';

import Todos from './Todos';

import './App.css';

const todos = [{
  title: 'clean',
  done: false,
  id: 1,
},
{
  title: 'do the dishes',
  done: true,
  id: 2,
}];

class App extends Component {
  render() {
    return (
      <Todos todos={todos} />
    );
  }
}

export default App;
