import React from 'react';

class Method extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      direction: ''
    }
  }

  changeDirection (evt, direction) {
    this.setState({
      direction
    })
  }

  render() {
    return (<React.Fragment>
      <div>Direction: {this.state.direction}</div>
      <div>
        <button onClick={(evt) => this.changeDirection(evt, 'Top')}>Top</button>
        <button onClick={(evt) => this.changeDirection(evt, 'Left')}>Left</button>
        <button onClick={(evt) => this.changeDirection(evt, 'Right')}>Right</button>
        <button onClick={(evt) => this.changeDirection(evt, 'Bottom')}>Bottom</button>
      </div>
    </React.Fragment>
    )
  }
}

export default Method;