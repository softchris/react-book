import React from 'react';
import ReactDOM from 'react-dom';
import ProductsList from '../ProductsList';
import nock from 'nock';

//jest.mock('../../products');


afterEach(() => {
  nock.cleanAll();
});

it('renders without crashing', () => {
  const scope = nock('http://myapi.com')
    .get('/products')
    .reply(200, {
      products: [{ id: 1, name: 'nocked data' }]
    }, {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json'
    });

  const div = document.createElement('div');
  ReactDOM.render(<ProductsList />, div);
  ReactDOM.unmountComponentAtNode(div);

  scope.isDone();
});
