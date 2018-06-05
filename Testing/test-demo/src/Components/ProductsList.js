import React from 'react';
import { getProducts } from '../products';

const Products = ({ products }) => (
  <React.Fragment>
    {products.map(p => <div>{product.name}</div>)}
  </React.Fragment>
);

class ProductsContainer extends React.Component {
  state = {
    products: [],
  }

  async componentDidMount() {
    console.log('fetching products');
    const products = await getProducts();
    this.setState({
      products
    });
  }

  render() {
    return (
      <Products products={this.state.products} />
    );
  }
}

export default ProductsContainer;
