import React, { Component } from 'react';
import styled from 'styled-components';

const Product = styled.div`
  box-shadow: 0 0 5px gray;
  padding: 20px;
  margin: 0 20px;
  margin-bottom: 20px;
`;

const data = [{
  name: 'socks'
},
{
  name: 'shoes'
}];

const Products = () => (
  <React.Fragment>
    <h2>Products</h2>
    {data.map( p => <Product>{p.name}</Product>)}
  </React.Fragment>

);

export default Products;
