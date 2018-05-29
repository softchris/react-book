import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { withCart } from './CartContext';

const ProductContainer = styled.div`
  padding: 40px;
  box-shadow: 0 0 5px gray;
  margin: 10px;
`;

const product = {
  name: 't-shirt',
};

class ProductPage extends React.Component {
  static propTypes = {
    addItem: PropTypes.func,
  }

  render() {
    const { addItem } = this.props;

    return (
      <ProductContainer>
        <h1>Product page</h1>
        <h3>{product.name}</h3>
        <button onClick={() => addItem(product)} >Add</button>
      </ProductContainer>
    );
  }
}

export default withCart(ProductPage);
