import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AsyncComponent from './AsyncComponent';

class Async extends React.Component {
  state = {
    Component: void 0
  };

  async componentDidMount() {
    const { Component } = await this.props.provider();
    this.setState({ Component });
  }

  render() {
    const { Component } = this.state;
    return(
      <React.Fragment>
        {Component ? <Component /> : <div>Loading...</div>}
        </React.Fragment>
    )
  }
}

const Main = () => (
  <Router>
    <Switch>
      <Route path='/' exact={true} component={() => <Async provider={() => import('./Home')} /> } />
      <Route path='/contact' exact={true} component={() => <Async provider={() => import('./Contact')} />} />
      <Route path='/products' exact={true} component={() => <Async provider={() => import('./Products')} />} />
    </Switch>
  </Router>
);

export default Main;
