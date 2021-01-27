import React from 'react';
    
class Person extends React.Component {    
  constructor() {
    super();
    this.state = {
      name : 'initial value' 
    }
  }

  changeName(evt) {
    // implement
    this.setState({
      name : evt.target.value
    })
  }

  render() {
    return (
      <React.Fragment>
        <div>{this.state.name}</div>
        <div><input type="text" onChange={(evt) => this.changeName(evt)} value={this.state.name} /></div>
      </React.Fragment>
    )
  }
}

export default Person;