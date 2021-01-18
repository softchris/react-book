# Leveraging the Context API in React.js

![](https://cdn-images-1.medium.com/max/800/1*Q1Nav21epDdeCE0Cd2f1SQ.jpeg)

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris


> The React Context exist so you don’t have to pass in data manually at every level. Context is about sharing data to many components

In this article we will learn about the following topics:

- **The context API** , what it is and why use it
- **Building blocks** , we will learn about the different building blocks using a Context and how they work together
- **In action** , we will look at several examples of creating a Context and we will ensure we learn about Dynamic contexts and how HOC, higher order components can help clean up our Context code

If you ever get lost following the code samples in the article, have a look at this demo containing all the code shown below:

[https://github.com/softchris/react-context-demo](https://github.com/softchris/react-context-demo)

### Why Context API and what is it?

The React Context exist so you don’t have to pass in data manually at every level. Context is about sharing data to many components. The reason we need the Context API is that it’s cumbersome to pass data from parent to child via props if there are many components requiring the same data. By using the Context API we no longer pass this kind of shared data with props.

#### When to use /not use it

Things that belong in a context is data that is considered global like a _user_ or a _cart_ etc. So let’s try to list the different reasons for using a Context:

- **data needed in many places** , data that needs to be used by many components like a theme, user or a cart
- **pass props through many components** , sometimes it’s better to use composition over context when you want to pass a props value through many components

#### Building blocks and API

The Context API consists of some building blocks that it is important that we know about what they are called but also what their role is:

- **context** , the context object is an object holding the current context value and can be subscribed to
- **provider** , This is a React component that provides the value in question, it grabs it from the context object
- **consumer** , This is a React component that is able to consume the value provided by the `Provider` and is able to show the value

This is all a bit theoretical and may sound a little confusing so let’s dive right into an example to clear any confusion.

### Context API in action

To utilize a Context in React we need to do the following:

- **create a context** , we do this with a call to React.createContext(), this will return a Context object that exposes a `Provider Component` as well as a `Consumer Component`
- **declare a provider** , this is us grabbing the `Provider` Component reference available in the context object we just created
- **declare a consumer** , this is also a component that lives on the Context object and we use this to show the value to the user

#### Creating a Context object

Let’s start by creating a React project using Create React App, CRA:

```
npx create-react-app context-demo
cd context-demo
npm start
```

Good, we have a project. Now let’s create a file called `theme.js`, it will hold our `Context` object.

It’s quite straight-forward to create a Context object. For that we use the `React.createContext()` method like so:

```jsx
// theme.js

import React from 'react';

const ThemeContext = React.createContext('light');

export default ThemeContext;
```

Above we call `createContext()` and we give it an input parameter which is simply the default value we want the context to have. We also export the object itself so we can use it in other places.

That’s very little code to write to use something as powerful as a `Context`. We haven’t seen anything yet though, so the fun has just begun:

#### Declare a Provider

Ok, so we have a `Context` object let’s grab a reference to a `Provider` next. For this, we will first create a component file `Sample.js`, you can really call it anything you want but the point is to have a React component to demonstrate how the `Context` object works. Let’s create a component:

```jsx
// Sample.js

import React from 'react';

import Theme from './theme';

const Sample = () => (

  <Theme.Provider value='dark'>
    // declare consumer
  </Theme.Provider>

);

export default Sample;
```

Above we are declaring a normal functional React component and we also import our `Theme`, our `Context` object. We then grab a reference to our provider by calling `Theme.Provider`. At this point, nothing really works, because we are lacking a `Consumer` component that can actually consume the value and thereby show it to a user.

Furthermore, we also set the value property to `dark`.

Wait wait, hold on… Didn’t we just set the value to light in our `theme.js` file, what’s the point of doing that if we are going to override it in the `Provider` anyway? Very good question, let’s save it a bit until we declared a Consumer and then it will all make sense.

#### Declare a Consumer

So next up is about declaring a `Consumer` component and show how we can show the value to the user. Let’s add that to our code:

```jsx
// Sample.js

import React from 'react';

import Theme from './theme';

const Sample = () => (
  <Theme.Provider value='dark'>
    <Theme.Consumer>
    {theme => <div>Our theme is: {theme}</div>}
    </Theme.Consumer>
  </Theme.Provider>
);

export default Sample;
```

Above we added our `Consumer`, in the form of `Theme.Consumer` component and we can see that we inside it define a function whose parameter is our theme value. We are then able to show the `theme` value in a div.

Ok then, let’s get back to our question, why are we setting the value property in our `Theme.Provider` component if we already set a *default value* in our `theme.js` file, here:

```js
// theme.js

import React from 'react';

const ThemeContext = React.createContext('light');

export default ThemeContext;
```

Well, the default value above won’t be used if we declare a `Provider`. If we are missing a `Provider` component, however, it will use the _default value_ as a fallback. So the following code will output `dark` as value, which is the value we give to the `Provider`:

```jsx
const Sample = () => (
  <Theme.Provider value='dark'>
    <Theme.Consumer>
    {theme => <div>Theme value: {theme}</div>}
    </Theme.Consumer>
  </Theme.Provider>
)
```

whereas this code will output `light` as value, e.g the *default value*:

```jsx
// Sample.js with a Provider missing

const Sample = () => (
  <Theme.Consumer>
  {theme => <div>Theme value: {theme}</div>}
  </Theme.Consumer>
);
```

#### Usage

Taking our `Context` for a spin means we need to create a `Provider` and a `Consumer` as we did in the last section, however, most likely the `Consumer` part is baked into a Component like so:

```jsx
// ThemedButton.js
import Theme from 'theme.js';

const ThemedButton = (props) => (

<Theme.Consumer>
{theme => <button { ...props }>button with them: {theme}</button>}
</Theme.Consumer>

);
export default ThemedButton
```

This means that our code from the last section can be cleaned up somewhat to look like this:

```jsx
// Sample.js

import React from 'react';

import Theme from './theme';
import ThemedButton from './ThemedButton';

const Sample = () => (

<Theme.Provider value='dark'>
  <ThemedButton />
</Theme.Provider>
);

export default Sample;
```

As you can see the value from the `Provider` is being passed down through the `props` and we can inside of the `ThemedButton` component access the `theme` property through the `Consumer`.

### Dynamic Context

What if we want to change the provider value? One way of doing that is by having a _dynamic context_. We can achieve that by placing our `Provider` inside of a component and let its value depend on the component state like so:

```jsx
// AnyComponent.js
import React from 'react';

class AnyComponent extends React.Component {
  state = {
    theme: 'dark'
  };

  render() {
    return (
      <ThemeContext.Provider value={ this.state.theme }>
        <ThemedButton />
      </ThemeContext.Provider>
    );
  }
}
```

Now it’s easy for us to change the state and thereby we can change the value the `Provider` is providing to any `Consumer`.

#### Changing the state example

Below we are creating a component containing a droplist with two different values `light` and `dark` and when we switch between the values, the state is altered and because the state is connected to the `Provider`, the provided value is changed with it.

Let’ look at the code:

```jsx
// AnyComponent.js

import React from 'react';
import Theme from './theme';
import ThemedButton from './ThemedButton';

class AnyComponent extends React.Component {
  state = {
    theme: 'dark',
    themes: ['light', 'dark']
  };

  handleSelect = (evt) => {
    console.log('Changing value to ' + evt.target.value);

    this.setState({
      theme: evt.target.value
    });
  };

  render() {
    return (
      <React.Fragment>
        <h2>Any component</h2>
        <select value = {this.state.theme}
        onChange ={this.handleSelect}>
        { this.state.themes.map(t =>
        <option value = {t} >{t}</option>)
        }
        </select>
        <div>
        Selected theme: {this.state.theme}
        </div>
        <Theme.Provider value ={this.state.theme}>
          <ThemedButton theme={this.state.theme} />
        </Theme.Provider>
      </React.Fragment>
    );
  }
}

export default AnyComponent;
```

We can see from the above code that when the `onChange` event is triggered we invoke the `handleSelect()` method and that leads to the state property `theme` being updated. That same property theme is what the `Theme.Provider` is assigning as its `value` attribute. Thereby a change in the droplist leads to the `Provider` component providing a new value. A fairly simple code flow but it does show where we should change things to get the Consumer component to display a new value.

#### Second example — a cart

Our next example is a little bit different. We have seen how we can expose a value from a components state and make that the value of the `Provider` component and thereby we can affect what the Provider provides. This can be taken to a further level. Further in the sense that we can not only expose the value of a Provider to a Consumer but also methods, methods that will allow us to change the provided value. Let’s look at some code for this:

```jsx
// cart.js

import React from 'react';

const CartContext = React.createContext({
  cart: void 0,
  addItem: () => {}
});

export default CartContext;
```

We start with creating our `Context` object and this time we give it a more complex data type than a string or a number. The input parameter to `createContext()` method is an object `{}` with a property `cart`.

A note `void 0` is just the same as `undefined`.

Next, we will create two different components:

- **CartPage**, this will contain our Consumer component and thereby display the value from our `Context` object
- **CartProvider**, this will be a component that will not only provide the value from the `Context` object but also expose a method with which we can change the provided value

Let’s start with `CartPage` component:

```jsx
// CartPage.js

import React from 'react';
import CartContext from './cart';

const products = [{
    id: 1,
    title: 'Fortnite'
  }, {
    id: 2,
    title: 'Doom'
  }, {
    id: 3,
    title: 'Quake'
}]

const CartPage = () => (
  <CartContext.Consumer>
    {({ cart, addItem }) => (
    <React.Fragment>
      <div>
        <h2>Product list</h2>
        {products.map(p => <button onClick={() => addItem(p)} value={p}>{p.title} . </button>)}
      </div>
      <div>
        <h2>Cart</h2>
        {cart.map(item => <div> {item.title} </div>)}
      </div>
    </React.Fragment>
    )}
  </CartContext.Consumer>
);

export default CartPage;
```

We see above that we use `CartContext` component and that we define and display our cart value, but there is an addition to it in the form of the `addItem()` method. This method will allow us to change the cart item, but how you ask? Let’s have a look at our `CartProvider` component next to find out the answer:

```jsx
import React from 'react';
import CartPage from './CartPage';
import CartContext from './cart';

class CartProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      cart: [],
      addItem: (item) => {
        this.setState({
          cart: [...this.state.cart, { ...item }]
        })
      }
    }
  }

  render() {
    return (
      <CartContext.Provider value = {this.state} >
        <CartPage />
      </CartContext.Provider>
    );
  }

}

export default CartProvider;
```

We can see here that the state object consists of the properties `cart` and `addItem` and what gets passed into the value property of the `CartContext.Provider `is this.state e.g both `cart` and `addItem()`. This means we could easily expand this with a `removeItem()` function or whatever we need, this is how we get more than just a value exposed to a `Consumer` component.

### Higher order component

Sometimes a context needs to be provided in many places. In our example above imagine the `cart` being used inside of a header that wants to show how many items you have in a cart. There might also be dedicated Cart Page where you can see the cart content more in detail. It might get tedious to have to wrap all those component content in a `Consumer` tag. For those situations, it’s better to use a HOC, a higher order component. This means we can create a function where we use our component as input and we augment the context data.

It can look like the following:

```jsx
// withCart.js
import CartContext from './cart';
import React from 'react';

export const withCart = (Component) => {
  return function fn(props) {
    return (
      <CartContext.Consumer>
      {(context) => <Component {...props} {...context} />}
      </CartContext.Consumer>
    );
  };
};
```

As you can see above, we are using a `Consumer` to make this happen but we also use the spread parameter `{ ...context}` to transfer what is in the context object to the underlying component. Now we can easily use this function to decorate our component, like so:

```jsx
// Header.js
import React from 'react';
import withCart from './withCart';

class Header extends React.Component {
  render() {
    const { cart } = this.props;
    return (
      {cart.length === ?
      <div>Empty cart</div> :
      <div>Items in cart: ({cart.length})</div>
      }
    );
  }

}

const HeaderWithCart = withCart(Header);
export default HeaderWithCart;
```

### Summary

In this article, we have covered quite a lot. We have explained what the `Context` API is and when to use it. We also talked about its building blocks `Provider` and `Consumer`. Furthermore, we have covered how to update provided values and lastly how we can clean up a bit using a HOC, a higher order component. Hopefully, you have found this useful. :)

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris
