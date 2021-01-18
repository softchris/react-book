import React from 'react';
import styled from 'styled-components';

const InnerButton = styled.button`
  padding: 20px;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
  :focus {
    border: solid 1px black;
  }
`;

class Button extends React.Component {
  render() {
    return (
      <InnerButton { ...this.props } >{this.props.children}</InnerButton>
    );
  }
}

export default Button;
