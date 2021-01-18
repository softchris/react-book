# Mocking HTTP calls with Nock

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

Nock is used to mock calls to HTTP. It makes it possible for us to specify what URLs to listen to and what to respond with. This is a fairly short article that shows how you use the library `nock`.


In this article we will cover:

- **set up**, setting up a `nock` and specify a mock response
- **query parameters**, see how we can set up our `nock` with query parameters
- **verification**, we should always verify that our `nocks` where hit. If they weren't then something changed and we need to change our tests to reflect that

## Scenario

Imagine we have the following files:

- **products.js**, a service that can retrieve data for us
- **ProductsList.js**, a component that calls a method on products.js to get data and render that

Let's have a look at what these two modules look like:

```js
// products.js

export const getProducts = async () => {
  const response = await fetch('http://myapi.com/products');
  const json = await response.json();

  return json.products;
}
```

Above we can see that we do a `fetch()` call to url `http://myapi.com/products` and thereafter we transform the response snd dig out the data `products`. Let's have a look at the component:

```js
// ProductsList.js

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
```

We can see that we use `product.js` module and call `getProducts()` in the `componentDidMount()` and end up rendering the data when it arrives.

## Testing it
If we wanted to test ProductsList.js module we would want to focus on mocking away `products.js` cause it is a dependency. We could use the library `nock` for this. Let's start off by installing `nock`, like so:

```js
yarn add nock
```

Let's now create a test `__tests__/ProductsList.js` and define it like the following:

```js
// __tests__/ProductsList.js

import React from 'react';
import ReactDOM from 'react-dom';
import ProductsList from '../ProductsList';
import nock from 'nock';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProductsList />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```
Let's see first what happens if we don't set up a `nock`:

We end up with the following:
![](/assets/Screen Shot 2018-06-04 at 13.40.09.png)

As you can see from the above it attempts to perform a network request. We should never do that when running a test. We could add a Jest mock for this that is definitely one way to solve it, then it would look like this:

```js
// __mocks__/products.js
export const getProducts = async () => {
  const products = await Promise.resolve([{ name: 'test' }]);
return products;
}
```

That works but let's look at how to solve it with `nock`. Because we are attempting to call `fetch()` in a node environment we need to ensure it is set up correctly. Suggestion is to set up the `global.fetch` and assign `node-fetch` to it, like so:

```js
// setupTests.js
global.fetch = require('node-fetch');
```
Let's now add `nock` to our test, like so:
```js
import React from 'react';
import ReactDOM from 'react-dom';
import ProductsList from '../ProductsList';
import nock from 'nock';

it('renders without crashing', () => {
  const scope = nock('http://myapi.com')
  .get('/products')
  .reply(200, {
    products: [{ id: 1, name: 'nocked data' }]
  }, {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json'
  });

  const div = document.createElement('div');
  ReactDOM.render(<ProductsList />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

Note above how we invoke the `nock()` method by first giving it the baseUrl `http://myapi.com` followed by the path `/products` and the HTTP verb `get` and how we define what the response should look like with `reply()`. We also give the `reply()` method a second argument to ensure `CORS` plays nicely. At this point our test works.:

![](/assets/Screen Shot 2018-06-04 at 15.00.47.png)

## Query parameters
What if we have a url that looks like this:

```
http://myapi.com/products?page=1&pageSize=10;
```
How we do we set up our `nock` to match it? Well, we can use the helper method `query` for that, like so:

```js
nock('http://myapi.com')
.get('/products')
.query({ page: 1, pageSize: 10 })
```

## Verify your mock/s
It's considered best practice to verify that the mocks you have set up are being hit. To do that we can call `done()` on the returned reference when we are calling `nock` like so:

```js
const scope = nock('http://myapi.com')
.get('/products')
.reply(200, {
  products: [{ id: 1, name: 'nocked data' }]
}, {
  'Access-Control-Allow-Origin': '*',
  'Content-type': 'application/json'
});


scope.done();
```

So what happens when we set up a mock and it's not being it? Well let's add another call to our test, like so:

```js
const users = nock('http://myapi.com')
.get('/users')
.reply(200, {
  products: [{ id: 1, name: 'user' }]
}, {
  'Access-Control-Allow-Origin': '*',
  'Content-type': 'application/json'
});
```

Now it looks like this:

![](/assets/Screen Shot 2018-06-04 at 15.19.02.png)

## Block HTTP calls
You should never let a HTTP call happen for real so therefore make sure to shut off that ability. We can do so by adding the following line to `setupTests.js`:

```js
// setupTests.js

import nock from 'nock';
nock.disableNetConnect();
```

## Summary
We have briefly explained what `nock` is and how to use it for different cases. This is just one way of many to handle HTTP calls.

There are a lot more you can do with `nock`, we have barely scraped the surface. Have a look at the official documentation [Nock documentation](https://www.npmjs.com/package/nock)
