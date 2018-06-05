import {render, Simulate, wait} from 'react-testing-library'
import React from 'react';
import 'jest-dom/extend-expect'
import Select from '../Note';

describe('Note', () => {
  it('save text', async() => {
    const {getByText, getByTestId, getByPlaceholderText, container, getByLabelText} = render(<Select />);
    const input = getByLabelText('Change text');

    input.value= 'input text';
    Simulate.change(input);
    Simulate.click(getByText('Save'));

    console.log('saved', getByTestId('saved').innerHTML);
    expect(getByTestId('saved')).toHaveTextContent('input text')
  })

  it('load data', async() => {
    const {getByText, getByTestId, getByPlaceholderText, container} = render(<Select />);

    Simulate.click(getByText('Load'));
    await wait(() => getByTestId('data'))
    const data = getByTestId('data')
    const elem = getByTestId('item');
    expect(elem).toHaveTextContent('test');
  })

});
