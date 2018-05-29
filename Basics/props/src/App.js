import React, { Component } from 'react';
import PropType from 'prop-types';

const jediData = {
  name: 'Yoda'
};

const jedis = [{
  name: 'Yoda'
},
{
  name: 'Palpatine'
}]

class Jedi extends React.Component {
  static propTypes = {
    jedi : PropType.shape({
      name: PropType.string.isRequired,
    })
  };

  render() {
    return (
      <div>Name: {this.props.jedi.name}</div>
    );
  }
}


class App extends Component {
  render() {
    return (
      <div>
        <Jedi jedi={{ title: 'Vader' }} />

        {jedis.map( jedi => <Jedi jedi={jedi} />)}
      </div>
    );
  }
}

export default App;
