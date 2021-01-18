import React from 'react';
import styled from 'styled-components';

const InnerContainer = styled.div`
  box-shadow: 0 0 5px gray;
  margin: 10px;
  padding: 20px;
  font-size: 20px;
`;

class CreateItem extends React.Component {
  state = {
    item: ''
  };

  onChange = (evt) => {
    this.setState({
      item: evt.target.value
    });
  }

  onAdd = (item) => {
    this.props.onAddItem(item);
    this.setState({ item: '' });
  }

  render() {
    const { item } = this.state;

    return (
      <InnerContainer>
        <input onChange={this.onChange} value={this.state.item} />
        <button onClick={() => this.onAdd(item)}>Save</button>
      </InnerContainer>
    );
  }
}

export default CreateItem;
