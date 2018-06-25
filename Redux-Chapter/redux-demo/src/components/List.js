import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import CreateItem from './CreateItem';

const Item = styled.div`
  box-shadow: 0 0 5px;
  margin-bottom: 10px;
  padding: 20px;
`;

const ItemsContainer = styled.div`
  margin: 10px;
`;

const Items = ({ items }) => (
  <ItemsContainer>
    {items.map(item => <Item>{item.title}</Item>)}
  </ItemsContainer>
);

const NoItems = () => (
  <div>No items yet</div>
);

const List = ({ items, onAddItem }) => (
  <React.Fragment>
    <CreateItem onAddItem={onAddItem} />
    {items.length === 0 ? <NoItems /> : <Items items={items} />}
  </React.Fragment>
);

List.propTypes = {
  items: PropTypes.array,
};

export default List;
