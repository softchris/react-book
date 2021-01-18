import React, { Component } from 'react';
import ThemeContext from './ThemeContext';
import UserContext from './UserContext';
import Cart from './Cart';

import './App.css';

const Title = (props) => (
  <ThemeContext.Consumer>
    {theme => <div {...props}>Here is the theme value: {theme}</div>}
  </ThemeContext.Consumer>
);

const User = () => (
  <UserContext.Consumer>
    {({ user, setUser }) => (
      <React.Fragment>
        <div>Current user: {user}</div>
        <button onClick={setUser}>Calling set user</button>
      </React.Fragment>
    )}
  </UserContext.Consumer>
);

const withUser = (Component) => {
  return function fn(props) {
    return (
      <UserContext.Consumer>
        {({ user }) => <Component {...props} user={user} /> }
      </UserContext.Consumer>
    );
  };
};

const Header = ({ user }) => (
  <div>Header, logged in user: <strong>{user}</strong> </div>
);

const HeaderWithUser = withUser(Header);

class App extends Component {
  constructor() {
    super();
    this.state = {
      context: {
        user: 'anonymous',
        setUser: (user) => {
          console.log('setting user', user);
          console.log(this.state.context);
          this.setState({
            context: {
              ...this.state.context,
              user,
            },
          });
        },
      },
      newUser: '',
      themes: ['light', 'dark'],
      theme: 'dark',
    };
  }

  handleChanged = (evt) => {
    this.setState({
      newUser: evt.target.value,
    });
  }

  handleChangedTheme = (evt) => {
    this.setState({
      theme: evt.target.value,
    });
  }

  render() {
    return (
      <React.Fragment>
        <Cart />
        <select value={this.state.theme} onChange={this.handleChangedTheme} >
          {this.state.themes.map(t => <option value={t}>{t}</option>)}
        </select>
        <div>
          Selected theme: {this.state.theme}
        </div>
        <ThemeContext.Provider value={this.state.theme}>

          <div>
            App
            <UserContext.Provider value={this.state.context}>
              <User />
              <HeaderWithUser />
            </UserContext.Provider>
            <input onChange={this.handleChanged} value={this.state.newUser} />
            <button onClick={() => this.state.context.setUser(this.state.newUser)}>Set new user</button>
            <Title title="here is a title" />
          </div>
        </ThemeContext.Provider>
      </React.Fragment>
    );
  }
}

export default App;
