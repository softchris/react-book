import renderer from 'react-test-renderer';
import React from 'react';

import Todos from '../Todos';

test('Todo - should create snapshot', () => {
  const component = renderer.create(
    <Todos todos={[{ title: 'item1', description: 'an item'}, {title: 'item2', description: 'another item'}]} />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
