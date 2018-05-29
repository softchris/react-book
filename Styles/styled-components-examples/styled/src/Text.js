import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ text, className, title }) => (
  <div title={title} className={className}> Here is text: {text}</div>
);

Text.propTypes = {
  text: PropTypes.string,
  className: PropTypes.any,
  title: PropTypes.string,
};

export default Text;
