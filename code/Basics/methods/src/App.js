import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    str: 'test',
    loading: true,
    data: 'some data',
  }

  click = () => {
    console.log('clicked ' + this.state.str);
    this.setState({
      loading: false
    })
  }

  getData() {
    if (this.state.loading) {
      return <div>loading...</div>;
    } else if(this.state.data) {
      return <div>{this.state.data}</div>;
    }
    return <div>{this.state.data}</div>;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.click}>Click</button>
        { this.getData() }
      </div>
    );
  }
}

export default App;
