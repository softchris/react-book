import React, { Component } from 'react';

const ProductDetail = ({ match }) => (
  <div>product detail: { match.params.id }</div>
);

export default ProductDetail;
