# Routing

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

## Type of routers

- BrowserRouter
- HashRouter
- Router


## Install and set up
Installing the router

```
npm install --save react-router-dom
```

### Adding the router

```js
// index.js

import { BrowserRouter } from 'react-router-dom'

ReactDOM.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'))
```

### Defining the routes

Our routes will be defined by x number of `Route` element where we specify which `path` they will match and what `component` that should respond. All these routes will be put inside of a `Switch` component. It will look like the following:

```js
// Main.js

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
```

Worth noting above is our usage of the attribute `exact`, without it our router wouldn't be able to tell the difference between `/products` and `/products/:id`. Removing it will lead to a product list being loaded even when we type `/products/111`. Why is that? The way the router is constructed it will match the first pattern it sees. Because we are a bit relaxed on the rules, that is a router containing `/products`. The following `Route`:

```js
<Route exact path='/products' component={Products}/>
```

Will match `/products` and `/products/114`. To fix this we re-add the `exact` attribute and suddenly it will *only* match `/products`. This means to match `/products/111` it needs to keep looking in our route definition tree and it will find the following to match it:

```
<Route path='/products/:id' component={ProductDetail}/>
```

As expected it now loads our product detail view instead.

## Set up the app
Now that we have installed the library. Set up a route dictionary it's time to talk about how we would define the skeleton of our app. Normally an app has a header and a body. So our App.js file will now look like this:

```js

import React, { Component } from 'react';
import Main from './Main';
import Head from './Head';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Head />
        <Main />
      </React.Fragment>
    );
  }
}

export default App;
```

We have already defined what the `Main` component looks like above in Main.js. What about `Head` component? Well this is typically where we define a menu the user can interact with. This is where we introduce the `Link` component. This will help us create links that our router knows how to respond to. Ultimately it will generate anchor, `a`-tags.

```js
// Head.js

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

```