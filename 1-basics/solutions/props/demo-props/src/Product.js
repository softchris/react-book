import React from 'react';
import PropType from 'prop-types';

const Product = (props) => <div>{props.data.name}</div>

Product.propTypes = {
  data : PropType.shape({
    name: PropType.string.isRequired,
  })
};

export default Product;