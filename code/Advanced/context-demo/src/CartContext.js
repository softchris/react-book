import React from 'react';

const CartContext = React.createContext({
  cart: [],
  addItem: (item) => { console.log('adding product', item); },
});

export const withCart = (Component) => {
  return function fn(props) {
    return (
      <CartContext.Consumer>
        {(context) => <Component {...props} {...context} /> }
      </CartContext.Consumer>
    );
  };
};

export default CartContext;


