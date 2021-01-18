# Lazy loading

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

Oftentimes building an app the resulting bundle tend to be fairly large as our project grows in size. This will affect the loading time of our app for users on connections with low bandwidth, mobile users for example. For that reason it's a good idea to only load as much of your application as you need.

What do we mean by that? Imagine your application consists of many many routes. Some routes you are likely to be visited often and some not so much. If you instruct your app to only load the routes the user really needs, at first load, then you can load in more routes as the user asks for them. We call this *lazy loading*. We are essentially creating one bundle that constitutes our initial application then many small bundles as we visit a specific route. We will need Webpack and React to work together on accomplishing this one.

Let's start by having a look at what our routes currently look like:

```js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './Home';
import Contact from './Contact';
import Products from './Products';

const home = () => import('./Home/index');
const contact = () => import('./Contact/index');

const Products = () => (
  <div>Products</div>
);

const Main = () => (
  <Router>
    <Switch>
      <Route path='/' exact={true} component={Home} /> } />
      <Route path='/' exact={true} component={Contact} /> } />
      <Route path='/' exact={true} component={Products} /> } />
    </Switch>
  </Router>
);

export default Main;
```

We can use the `import` function to help us import a component when we need it and thereby accomplishing a lazy load behavior, like so:

```
import('./Home')
```

Though this isn't quite enough.

Why? This returns a `Promise`. Not only that, it's not a valid React child so we need to stick it into a component. For that reason we write a component whose job it is to retrieve the result and ensure we render out our fetched component, like so:

```js
class Async extends React.Component {
  state = {
    Component: void 0
  };

async componentDidMount() {
  const res = await this.props.provider();
  this.setState({ Component: res.default });
}

  render() {
    const { Component } = this.state;
    return (
      <React.Fragment>
      {Component ? <Component /> : <div>Loading...</div>}
      </React.Fragment>
    )
  }
}
```
Now we can set up a route like so:

```html
<Route path='/products' exact={true} component={() => <Async provider={() => import('./Products/Products')} />} />
```

However this doesn't look quite nice though, we are accessing the `default` property of our import and `/Products/Products` as route could look better. It would be nicer if we could define our import url as `/Products` and be able to avoid accessing the default import. We do need to alter the component directory a bit from:

```
/Products
Products.js
```
to

```
/Products
Products.js
index.js
```
In our newly created `index.js` we can import our component and export it, like so:

```js
// Products/index.js

import Products from './Products';
export const Component = Products;
```

Let's head back to Main.js and change the `Async` component to this:

```js
class Async extends React.Component {
  state = {
    Component: void 0
  };

  async componentDidMount() {
    const { Component } = await this.props.provider();
    this.setState({ Component });
  }

  render() {
    const { Component } = this.state;
      return (
        <React.Fragment>
        {Component ? <Component /> : <div>Loading...</div>}
        </React.Fragment>
      )
  }
}
```
The big difference here is getting our component like this `const { Component } = await this.props.provider()`. Now let's update how we set up the route to this:

```html
<Route path='/products' exact={true} component={() => <Async provider={() => import('./Products')} />} />
```

`/Products/Products` has been replaced with `/Products`, much better.

Head back to your browser and try to navigating to the different routes. You will notice how there are bundles being loaded in every time one of our lazy routes are hit. That's it, you know have lazy loaded routes and your mobile users will thank you.