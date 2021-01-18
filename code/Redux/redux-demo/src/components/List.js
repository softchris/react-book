import React from 'react';

const List = ({ items }) => (
  <React.Fragment>
    {items.map(item => <div>{item.title}</div>)}
  </React.Fragment>
);

export default List;
