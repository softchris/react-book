import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'

const Menu = styled.div`
  box-shadow: 0 2px 2px;
  border-bottom: solid 1px grey;
  padding: 20px;
  margin-bottom: 20px;
`;

const MenuItem = styled(Link)`
  padding: 20px 10px;
`;

const Head = () => (
  <Menu>
    <MenuItem to="/" >Home</MenuItem>
    <MenuItem to="/products" >Products</MenuItem>
  </Menu>
);

export default Head;
