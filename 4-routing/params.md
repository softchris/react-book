# Dealing with router and query params

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

There are two different concepts that interest us, the first is router parameters and the second is query parameters. What are these concepts?
A router parameter is part of your url and can look like the following:

```
/products/111
/users/1/products
```

## Router params
In the first case we query against a resource /products and is looking for a particular item `111`.

In the second case we are looking at the resource `users` and the specific user with `id` having value `1`.

So router parameters are part of your url. Usually what we do is having a user navigate to a page and if necessary we dig out the router parameter, cause it needs to be part of our query. Imagine that the link `/products/111` is clicked. This will mean we will take the user to a `ProductDetail` component where we will need to:

- dig out the the router param
- pose a query based on said param and show the result

```js
class ProductDetail extends React.Component {
  state = {
    product: void 0
  }

  async componentDidMount() {
    const product = await api.getProduct(`/products/${this.props.match.params.id}`);
    this.setState({
      product,
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.product &&
        <div>{this.state.product.name}</div>
        }
      </React.Fragment>
    );
  }
}
```

The interesting part here being how we access the router parameter:

```js
this.props.match.params.id
```

There is a match object that contains a `params` object that points to our router parameter `id`.

Let's quickly remind ourself how this router was set up:

```
<Route path='/products/:id' component={ProductDetail}/>
```

Above you can see that we define the route `/products/:id`, and thereby we set the wildcard to `:id`, which makes it possible for us to access it in code by typing `this.props.match.params.id`.

## Query params
Let's talk about query parameters next. A query parameter is used to filter down a resource. A typical example is using parameters like `pageSize` or `page` to indicate to the backend that you only want a small slice of content and not the full list which can be millions of rows potentially. Query parameters are found after the `?` character in the url which would make the url look like this `/products?page=1&pageSize=20`. Let's have a look in code how we can access query parameters:

```js
import React from 'react';
import { parse } from 'query-string';

class Products extends React.Component {
  state = {
    products: []
  };

  async componentDidMount() {
    const { location: { search } } = this.props;
    const { page, pageSize } = search;
    const products = await api.getProducts(`/products?page=${page}&pageSize=${pageSize}`);
    this.setState({
      products,
    });
  }

  render() {
    <React.Fragment>
    {this.props.products.map(product => <div>{product.name}</div>)}
    </React.Fragment>
  }
}
```
As you can see above we are able to access our query parameters through a `location` object that sits on a `search` object that represents our parameters like so:

```js
{
  page: 1,
  pageSize: 20
}
```