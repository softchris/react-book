# JSX

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

This chapter covers:

- **What** is JSX
- **Why** use it

## What & Why

JSX is pretty much you writing XML in JavaScript. It's a preprocessor step. You don't have to have it but it makes life a whole lot easier.

### Simple example

This is a simple example on one line of code:

```js
const Elem = <h1>Some title</h1>;

// and you can use it in React like so:
<div>
  <Elem />
</div>
```

The above looks like XML in JavaScript. When it is being processed it is turned into the following ES5 code:

```js
React.createElement('Elem', null, 'Some title');
```

Ok so `Elem` becomes the element name, the second argument that above is null are our element attributes, which we don't have any. The third and last argument is the elements value. Let's look at an example below where we give it a property:

```js
const Elem = <h1>Some title</h1>;

// usage:
<div>
  <Elem title="a title">
</div>
```

The above would become the following code:

```js
React.createElement(
  'Elem', 
  { 
    title: 'a title' 
  }, 
  'Some title'
);
```

Above we can see that our attribute `title` is now part of the second argument.

### Multiline

Most of the time you will define JSX over several different rows and starting out new it might stump you why it doesn't work. You simply need to wrap it in a parenthesis, like so:

```jsx
const Elem =
(
  <div>
    <h1>Some title</h1>
    <div>Some content</div>
  </div>
)
```

### One parent

JSX needs to have one parent. The following would be incorrect:

```html
// would be incorrect, no parent element
const Elem =
(
  <h1>Some title</h1>
  <div>Some content</div>
)
```

We can fix this by either wrapping the in div element like so:

```html
const Elem =
(
  <div>
    <h1>Some title</h1>
    <div>Some content</div>
  </div>
)
```

or we can wrap it in a React.Fragment, like so:

```html
const Elem = (
<React.Fragment>
  <h1>Some title</h1>
  <div>Some content</div>
</React.Fragment>
)
```

React.Fragment would be the parent element needed instead of us using a div element just to make JSX happy.

## Summary

This is pretty much all we need to know on JSX to be able to work with it:

* It's like XML that gets translated to `React.createElement()` calls
* Multiline needs parenthesis to work
* We need to have a parent element, React.Fragment is good option for that