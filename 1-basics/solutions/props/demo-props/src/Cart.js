import React from 'react';
import Product from './Product';

class Cart extends React.Component {
  render() {
    return (
      <div>{this.props.data.map( product => <Product data={product} />)}</div>
    );
  }
}

export default Cart;