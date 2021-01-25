import Product from './Product';
import Cart from './Cart'
import React from 'react';
import ReactDOM from 'react-dom';
  
const title = 'Your awesome React app';
const products = [
  {
    name: 'Game console'
  },
  {
    title: 'Game'
  }
]

ReactDOM.render(
  <Cart data={products} />,
  document.getElementById('app')
);