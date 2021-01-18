import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import './App.css';
import Text from './Text';

const FramedText = styled(Text).attrs({ title: 'framed' })`
  border: solid 2px black;
  color: blue;
  font-size: 16px;
  padding: 30px;
`;

const Button = styled.button.attrs({ title: 'titled' })`
  background: ${props => props.theme.bgcolor};
  color: ${props => props.theme.color};
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }

   ${props => props.primary && css`
    background: green;
    color: white;
  `}

  border-radius: ${props => (props.round ? '50%' : '7px')}
`;

const GiantButton = Button.extend`
  font-size: 48px;
`;

const GiantButtonWithTitle = Button.extend.attrs({
  title: 'giant button',
})``;

const LinkButton = Button.withComponent('a');

class App extends Component {
  render() {
    return (
      <div className="App">
        <h2>Demoes</h2>
        <h3>Buttons</h3>
        <div>
          <Button>Default button</Button>
        </div>
        <div>
          <Button disabled>Disabled button</Button>
        </div>
        <div>
          <Button primary>Disabled button</Button>
        </div>
        <div>
          <Button round>Disabled button</Button>
        </div>
        <h3>Components</h3>
        <div>
          <FramedText text="some text" />
        </div>
        <div>
          <GiantButton >Giant text</GiantButton>
        </div>
        <div>
          <LinkButton>link button</LinkButton>
        </div>
        <div>
          <GiantButtonWithTitle>test</GiantButtonWithTitle>
        </div>
      </div>
    );
  }
}

export default App;
