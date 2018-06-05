import {render, Simulate, wait} from 'react-testing-library'
import React from 'react';
import 'jest-dom/extend-expect'
import Todos from '../Todos';

const todos = [{
  title: 'todo1'
},
{
  title: 'todo2'
}];

describe('Todos', () => {
  it('finds title', () => {
    const {getByText, getByTestId, container} = render(<Todos todos={todos} />);
    const elem = getByTestId('item');
    expect(elem.innerHTML).toBe('todo1');
  })

  it('select todo', () => {
    const {getByText, getByTestId, container} = render(<Todos todos={todos} />);
    Simulate.click(getByText('Select'));
    const elem = getByTestId('item');
    expect(elem.classList[0]).toBe('selected');
  })
});
