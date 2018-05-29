import React from 'react';
import styled from 'styled-components';
import CartContext from './CartContext';
import Product from './Product';

const CartItem = styled.div`
  box-shadow: 0 0 5px grey;
  margin-bottom: 10px;
  padding: 20px;
`;

const CartPage = () => (
  <CartContext.Consumer>
    {({ cart }) => (
      <React.Fragment>
        <h2>Cart</h2>
        {cart.map(item => <CartItem>{item.name}</CartItem>)}
      </React.Fragment>
    )}
  </CartContext.Consumer>
);

class CartProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      cart: [{ name: 'socks' }],
      addItem: (item) => {
        this.setState({
          cart: [...this.state.cart, { ...item }],
        });
      },
    };
  }
  render() {
    return (
      <CartContext.Provider value={this.state}>
        <CartPage />
        <Product />
      </CartContext.Provider>
    );
  }
}

export default CartProvider;
