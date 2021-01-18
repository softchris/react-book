import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Pages/Home';
import Products from './Pages/Products';
import ProductDetail from './Pages/ProductDetail';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/products' component={Products}/>
      <Route path='/products/:id' component={ProductDetail}/>
    </Switch>
  </main>
);

export default Main;
