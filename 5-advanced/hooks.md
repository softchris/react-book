# React Hooks - best thing since sliced bread?

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

> Hooks are an upcoming feature that lets you use state and other React features without writing a class component - functions FTW.

Hooks is the latest pattern and an experimental feature that's supposedly better than sliced bread. Everyone used to go nuts over [Render props](/patterns/render-props.md) but now it's all hooks.

Hooks are currently in React v16.8.0-alpha.0 so you can try them out already :)

![](/assets/Screen Shot 2019-01-22 at 15.18.11.png)

## Problems Hooks are trying to address
Every time something new comes out we get excited. It's ketchup, it's the best thing since sliced bread and so on. We hope that this will finally be the solution to all our problems, so we use it, again and again and again. We've all been guilty of doing this at one time of another, abusing a pattern or paradigm and yes there has always been some truth to it that the used pattern has been limited.

Below I will try to lay out all the different pain points that makes us see Hooks as this new great thing. A word of caution though, even Hooks will have drawbacks, so use it where it makes sense. But now back to some bashing and raving how the way we used to build React apps were horrible;)

There are many problems Hooks are trying to address and solve. Here is a list of offenders:

- **wrapper hell**, we all know the so called _wrapper hell_. Components are surrounded by layers of `providers`, `consumers`, `higher-order components`, `render props`, and other abstractions, exhausted yet? ;)

Like the whole wrapping itself wasn't bad enough we need to restructure our components which is tedious, but most of all we loose track over how the data flows.

- **increasing complexity**, something that starts out small becomes large and complex over time, especially as we add lifecycle methods
- **life cycle methods does too many things**,
components might perform some data fetching in `componentDidMount` and `componentDidUpdate`. Same `componentDidMount` method might also contain some unrelated logic that sets up event listeners, with cleanup performed in `componentWillUnmount`

> Just create smaller components?

In many cases it’s not possible because:
- **difficult to test**, stateful logic is all over the place, thus making it difficult to test
- **classes confuse both people and machines**, you have to understand how `this` works in JavaScript, you have to bind them to event handlers etc.
The distinction between function and class components in React and when to use each one _leads to disagreements_ and well all know how we can be when we fight for our opinion, spaces vs tabs anyone :)?.
- **minify issues**, classes present issues for today’s tools, too. For example, classes don’t minify very well, and they make hot reloading flaky and unreliable. Some of you might love classes and some of you might think that functions is the only way. Regardless of which we can only use certain features in React with classes and if it causes these minify issues we must find a better way.

### Selling point of Hooks
Hooks let you use more of React’s features **without classes**. Not only that, we are able to create Hooks that will allow you to:

- **extract stateful logic from a component**, so it can be tested independently and reused.
- **reuse stateful logic**, without changing your component hierarchy. This makes it easy to share Hooks among many components or with the community.

## What is a hook?
Hooks let you `split one component into smaller functions` based on what `pieces are related` (such as setting up a subscription or fetching data), rather than forcing a split based on lifecycle methods.

Let's have an overview of the different Hooks available to use. Hooks are divided into `Basic Hooks` and `Additional Hooks`. Let's list the `Basic Hooks` first and mention briefly what their role is:

### Basic Hooks
- **useState**, this is a hook that allows you to use state inside of function component
- **useEffect**, this is a hook that allows you to perform side effect in such a way that it replaces several life cycle methods
- **useContext**, accepts a context object (the value returned from React.createContext) and returns the current context value, as given by the nearest context provider for the given context.
When the provider updates, this Hook will trigger a rerender with the latest context value.

We will focus on `useState` and `useEffect` in this article.

### Additional Hooks
We will not be covering `Additional Hooks` at all as this article would be way too long but you are encouraged to read more about them on [Additional Hooks](https://reactjs.org/docs/hooks-reference.html#additional-hooks)

- **useReducer**, alternative to `useState`, it accepts a reducer and returns a pair with the current state and a `dispatch` function
- **useCallback**, will return a memoized version of the callback that only changes if one of the inputs has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders
- **useMemo**, passes a _create_ function and an array of inputs. `useMemo` will only recompute the memoized value when one of the inputs has changed. This optimization helps to avoid expensive calculations on every render.
- **useRef**, returns a mutable ref object whose `.current` property is initialized to the passed argument (initialValue). The returned object _will persist for the full lifetime of the component_
- **useImperativeHandle**, customizes the instance value that is exposed to parent components when using ref
- useLayoutEffect, the signature is identical to useEffect, but it fires _synchronously_ after all DOM mutations. Use this to read layout from the DOM and synchronously re-render
- **useDebugValue**, can be used to display a label for custom hooks in React DevTools

As you can see above I've pretty much borrowed the explanation for each of these `Additional Hooks` from the documentation. The aim was merely to describe what exist, give a one liner on each of them and urge you to explore the documentation once you feel you've mastered the `Basic Hooks`.

### First example - useState
This hook let's us use state inside of a function component. Yep I got your attention now right? Usually that's not possible and we need to use a `class` for that. Not anymore. Let's show what using `useState` hook looks like. We need to do two things to get started with hooks:
- scaffold a project using Create React App
- upgrade `react` and `react-dom`

The first one we will solve by typing:

> npx create-react-app hooks-demo

next we need to upgrade `react` and `react-dom` so they are using the experimental version of React where hooks are included:

> yarn add react@next react-dom@next

Now we are good to go:

```js
import React, { useState } from 'react';

const Counter = () => {
  const [counter, setCounter] = useState(0);
  
  return (
    <div>
      {counter}
      <button onClick={() => setCounter(counter + 1)} >Increment</button>
    </div>
  )
}

export default Counter;
```
Ok we see that we use the Hook `useState` by invoking it and we invoke it like so:

> useState(0)

This means we give it an initial value of 0. What happens next is that we get an array back that we do a destructuring on. Let's examine that closer:
> const [counter, setCounter] = useState(0);

Ok, we name the first value in the array `counter` and the second value `setCounter`. The first value is the actual value that we can showcase in our `render` method. The second value `setCounter()` is a function that we can invoke and thereby change the value of `counter`. So in a sense, `setCounter(3)` is equivalent to writing:
> this.setState({ counter: 3 })

Just to ensure we understand how to use it fully let's create a few more states:

```js
import React, { useState } from 'react';

const ProductList = () => {
  const [products] = useState([{ id: 1, name: 'Fortnite' }]);
  const [cart, setCart] = useState([]);

  const addToCart = (p) => {
    const newCartItem = { ...p };
    setCart([...cart, newCartItem]);
  }

  return (
    <div>
      <h2>Cart items</h2>
      {cart.map(item => <div>{item.name}</div>)}
      <h2>Products</h2>
      {products.map(p => <div onClick={() => addToCart(p)}>{p.name}</div>)}
    </div>
  )
}
export default ProductList;
```
Above we are creating the states `products` and `cart` and in doing so we also get their respective change function `setProducts` and `setCart`. We can see in the markup we invoke the method `addToCart()` if clicking on any of the items in our `products` list. This leads to the invocation of `setCart`, which leads to the selected product ot be added as a cart item in `cart`. This is a simple example but it really showcases the usage of `setState` hook.

## Handling side-effects with a Hook

The Effect hook is meant to be used to perform side effects like for example HTTP calls.
It performs the same task as life cycle methods `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

Here is how we can use it:
```js
import React, { useEffect, useState } from 'react';

const products = [{ id: 1, name: "Fortnite" }, { id: 2, name: "Doom" }];

const api = {
  getProducts: () => {
    return Promise.resolve(products);
  },
  getProduct: (id) => {
    return Promise.resolve(products.find(p => p.id === id));
  }
}

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState('');
  const [selected, setSelected] = useState(2);

  async function fetchData() {
    const products = await api.getProducts();
    setProducts(products);
  }

  async function fetchProduct(productId) {
    const p = await api.getProduct(productId);
    setProduct(p.name);
  }

  useEffect(() => {
    console.log('use effect');
    fetchData();
    fetchProduct(selected);
  }, [selected]);

return (
  <React.Fragment>
    <h1>Async shop</h1>
    <h2>Products</h2>
    {products.map(p => <div>{p.name}</div>)}
    <h3>Selected product</h3>
    {product}
    <button onClick={() => setSelected(1)}>Change selected</button>
  </React.Fragment>
);

}

export default ProductList;
```

Ok, a lot of interesting things was happening here. Let's start by looking at our usage of `useEffect`:

```js
useEffect(() => {
  console.log('use effect');
  fetchData();
  fetchProduct(selected);
}, [selected]);
```

What we are seeing above is us calling `fetchData` and `fetchProduct`. Both these methods calls methods marked by `async`. Why can't we just make the calling function in `useEffect` async, well that's a limitation of hooks unfortunately.

Looking at the definition of these two methods it looks like the following:

```js
async function fetchData() {
  const products = await api.getProducts();
  setProducts(products);
}

async function fetchProduct(productId) {
  const p = await api.getProduct(productId);
  setProduct(p.name);
}
```

We see above that we are calling `getProducts` and `getProduct` on `api` which both returns a Promise. After having received the resolved Promise, using `await` we call `setProducts` and `setProduct` that are functions we get from our `useState` hook. Ok, so this explains how `useEffect` in this case acts like `componentDidMount` but there is one more detail. Let's look at our `useEffect` function again:

```
useEffect(() => {
  console.log('use effect');
  fetchData();
  fetchProduct(selected);
}, [selected]);
```

The interesting part above is the second argument `[selected]`. This is us looking at the `selected` variable and let ourselves be notified of changes, if a change happens to `selected` then we will run our `useEffect` function.

Now, try hitting the bottom button and you will see `setSelected` being invoked which trigger `useEffect` because we are watching it.

### Life cycle
Hooks replaces the needs for many life cycle methods in general so it's important for us to understand which ones.

Let's discuss Effect Hooks in particular and their life cycle though.

The following is known about it's life cycle:

- By default, React runs the effects after every render
- Our effect is being run after React has flushed changes to the DOM — including the first render

### Accessing the DOM tree

Let's talk about when we access the DOM tree, to perform a side effect. If we are not using Hooks we would be doing so in the methods `componentDidMount` and `componentDidUpdate`. The reason is we cant use the `render` method cause then it would happen to early.

Let's show how we would use life cycle methods to update the DOM:

```js
componentDidMount() {
  document.title = 'Component started';
}

componentDidUpdate() {
  document.title = 'Component updated'
}
```

We see that we can do so using two different life cycle methods.

Accessing the DOM tree with an Effects Hook would look like the following:

```js
  const TitleHook = () => {
  const [title, setTitle] = useState('no title');

  useEffect(() => {
    document.title = `App name ${title} times`;
  })
}
```

As you can see above we have access to `props` as well as `state` and the DOM.

Let's remind ourselves what we know about our Effect Hook namely this:
> Our effect is being run after React has flushed changes to the DOM — including the first render

That means that two life cycle methods can be replaced by one effect.

### Handling set up/ tear down
Let's now look at another aspect of the `useEffect` hook namely that we can, and we should, clean up after ourselves. The idea for that is the following:

```
useEffect(() => {
  // set up
  // perform side effect
  return () => {
    // perform clean up here
  }
});
```

Above we see that inside of our `useEffect()` function we perform our side effect as usual, but we can also set things up. We also see that we return a function. Said function will be invoked the last thing that happens.

What we have here is _set up_ and _tear down_. So how can we use this to our advantage? Let's look at a bit of a contrived example so we get the idea:

```
useEffect(() => {
  const id = setInterval(() => console.log('logging'));

  return () => {
    clearInterval(id);
  }
})
```

The above demonstrates the whole _set up_ and _tear down_ scenario but as I said it is a bit contrived. You are more likely to do something else like setting up a socket connection for example, e.g some kind of subscription, like the below:

```
onMessage = (message) => {
  // do something with message
}

useEffect(() => {
  chatRoom.subscribe('roomId', onMessage)
  
  return () => {
    chatRoom.unsubscribe('roomId');
  }
})
```

## Can I create my own Hook?
Yes you can. With `useState` and `useEffect` the world is completely open. You can create whatever hook you need.

Ask yourself the following questions; Will my component have a state? Will I need to do a DOM manipulation or maybe an AJAX call? Most of all, is it something usable that more than one component can benefit from? If there are several _yes_ here you can use a hook to create it.

Let's look at some interesting candidates and see how we can use hooks to build them out:

You could be creating things like:

* **a modal**, this has a state that says wether it shows or not and we will need to manipulate the DOM to add the modal itself and it will also need to clean up after itself when the modal closes
* **a feature flag**, feature flag will have a state where it says wether something should be shown or not, it will need to get its state initially from somewhere like `localStorage` and/or over HTTP

* **a cart**, a cart in an e-commerce app is something that most likely follows us everywhere in our app. We can sync a cart to `localStorage` as well as a backend endpoint.

### Feature flag
Let's try to sketch up our hook and how it should be behaving:

```js
import React, { useState } from 'react';

function useFeatureFlag(flag) {
  let flags = localStorage.getItem("flags");
  flags = flags ? JSON.parse(flags) : null;

  const [enabled] = useState(Boolean(flags ? flags[flag]: false));

  return [enabled];
}

export default useFeatureFlag;
```
Above we have created a hook called `useFeatureFlag`. This reads its value from `localStorage` and it uses `useState` to set up our hook state. The reason for us not destructuring out a set method in the hook is that we don't want to change this value unless we reread the whole page, at which point we will read from `localStorage` anew.

Now we have create our custom Hook, let's take it for a spin:

```js
import React from 'react';
import useFeatureFlag from './flag';

const TestComponent = ({ flag }) => {
  const [enabled] = useFeatureFlag(flag);

  return (
    <React.Fragment>
      <div>Normal component</div>
      {enabled &&
      <div>Experimental</div>
      }
    </React.Fragment>
  );
};

export default TestComponent;

// using it
<TestComponent flag="experiment1">
```

We said earlier we weren't interested in changing the value exposed by `useFeatureFlag`. To control our feature flags we opt for creating a specific Admin page. We count on the Admin page to be on a specific page and the component with the feature flag on another page. Result of that is were we to navigate between the two pages then we can guarantee that the feature flag component reads from `localStorage`.

Imagine you have an admin page. On that admin page it would be neat if we could list all the flags and toggle them any way we want to. Let's write such a component:

```js
import React, { useState } from 'react';

const useFlags = () => {
  let flags = localStorage.getItem("flags");
  flags = flags ? JSON.parse(flags) : {};

  const [ flagsValue, setFlagsValue ] = useState(flags);

  const updateFlags = (f) => {
    localStorage.setItem("flags", JSON.stringify(f));
    setFlagsValue(f);
  }

  return [flagsValue, updateFlags];
}

const FlagsPage = () => {
  const [flags, setFlags] = useFlags();

  const toggleFlag = (f) => {
    const currentValue = Boolean(flags[f]);
    flags[f] = !currentValue;
    setFlags(flags)
  }

  return (
    <React.Fragment>
      <h1>Flags page</h1>
      {Object.keys(flags).filter(key => flags[key]).map(flag => <div><button onClick={() => toggleFlag(flag)}>{flag}</button></div>)}
    </React.Fragment>
  )
}

export default FlagsPage;
```

What we are doing above is to read out the flags from `localStorage` and then we render them all out. While rendering them out, flag by flag, we also hook-up ( I know we are talking about hooks here but no pun intended, really :) ) a method on the `onClick`. That method is `toggleFlag` that let's us change a specific flag. Inside of `toggleFlag` we not only set the new flag value but we also ensure our `flags` have the latest updated value.

It should also be said that us creating `useFlags` hook have made the code in `FlagsPage` quite simple, so hooks are good at cleaning up a bit too.

## Summary

In this article we have tried to explain the background and the reason hooks where created and what problems it was looking to address and hopefully fix.

We have learned the following, hopefully;):
- **useState**, is a Hook we can use to persist state in a functional component
- **useEffect** is also a Hook but for side effects

we can use one or both of the mentioned hook types and create really cool and reusable functionality, so go out there, be awesome and create your own hooks.

### Further reading
- [Hooks documentation](https://reactjs.org/docs/hooks-overview.html)
- [Motivation behind hooks](https://reactjs.org/docs/hooks-intro.html#motivation)
