# JSX

> Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

This chapter covers the following topics:

- **What is JSX**. JSX is something you use all the time in React. Lets explain what it is.
- **Why use it**. You can opt out of using JSX but almost no one does, and it does make your life simpler.

## What & Why

JSX is pretty much you writing XML in JavaScript. It's a _pre processor_ step. You don't have to have it, but it makes life a whole lot easier.

### Simple example

This is a simple example on one line of code:

```js
const Elem = <h1>Some title</h1>;

// and you can use it in React like so:
<div>
  <Elem />
</div>
```

The above declaration of `Elem` looks like XML in JavaScript. So what happens? When it is being processed, it is turned into the following ES5 code:

```js
React.createElement('Elem', null, 'Some title');
```

Ok so calling `createElement`, here are the parameters:

- **First parameter, element name**.`Elem` becomes the element name.
- **Second parameter, attributes**. the second argument above is `null` and represents our element attributes, which we don't have any.
- **Third parameter, element value**. The third and last argument is the elements value.

#### With attribute example

Let's look at an example below where we give it an attribute:

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

Most of the time, you will define JSX over several different rows and starting out new, it might stump you why it doesn't work.

The solution is to wrap multiple elements in a parenthesis `()`, like so:

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

JSX needs to have one parent. The following would be **incorrect**:

```html
<!-- would be incorrect, no parent element -->
const Elem =
(
  <h1>Some title</h1>
  <div>Some content</div>
)
```

You can fix this by either:

- **Wrapping it in an element**. You can wrap your content in a div element like so:

   ```html
    const Elem =
    (
      <div>
        <h1>Some title</h1>
        <div>Some content</div>
      </div>
    )
    ```

- **Use `React.Fragment`**. You can wrap it in a `React.Fragment`, like so:

    ```html
    const Elem = (
    <React.Fragment>
      <h1>Some title</h1>
      <div>Some content</div>
    </React.Fragment>
    )
    ```

`React.Fragment` would be the parent element  instead of us using a `div`.

## Summary

This is pretty much all we need to know on the topic of JSX to be able to work with it:

- It's like XML that gets translated to `React.createElement()` calls.
- Multiline needs parenthesis to work.
- You need to have one parent element, `React.Fragment` is good option for that.
