# Introducing props

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

> Adding props, or properties to your component means we add attributes to our component element. This means we can pass data from an outer component to an inner component. That data can bee either data that wee want to render a or a function that we want to invoke.

In this chapter we will cover the following:

- **Passing data**, we will pass data from the outside and render that in the component
- **Passing a function**, we will pass a function and learn to invoke it
- **Validate**, we will learn to validate our input properties by using the library `PropTypes`

## Passing data

 We can read what these attributes are and make them part of the markup, like so:

```js
const jediData = {
  name: 'Yoda'
};

class Jedi extends React.Component {
  render() {
    return (
      <div>{this.props.jedi.name}</div>
    );
  }
}

// example usage would be

<Jedi jedi={jediData} />
```

In the above code we assign `jediData` to the attribute `jedi`. An attribute on component is known as a prop. To access it we simply need to type `this.props.jedi`. In the `render()` method above we type `this.props.jedi.name` and thereby we access the object we assigned to it and drill down to the `name` attribute.

### Assigning a list

We usually deal with either rendering an object or a list or primitive. To render a list is almost as simple as rendering an object. A list of Jedis is only about rendering a list Jedi components, like so:

```js
const jedis = [
  {
    name: 'Yoda'
  },
  {
    name: 'Palpatine'
  }
]

class Jedis extends React.Component {
  render() {
    return (
      <div>{this.props.jedis.map( jedi => <Jedi jedi={jedi} />)}</div>
    );
  }
}


class Jedi extends React.Component {
  render() {
    return (
      <div>Name: {this.props.jedi.name}</div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Jedis jedis={jedis} />
      </div>
    );
  }
}
```

Above we use a simple `map()` function to output a list of `Jedi` elements. For each item in the list we bind that to our `jedi` property on our `Jedi` component.

## Passing a function

## Validate with PropTypes

As our components becomes more and more complicated we want to ensure we use them correctly. For example if a component has a certain property set it should render it. We might even go so far as to convey that if a property is not set we should throw an error. The library prop-types helps us to define what properties are a must and helps us define what type they are. Let's download it and demonstrate those features:

```
npm install prop-types
yarn add prop-types // or this one, depending on if you are using NPM or Yarn
```

Simply use it by:

* importing it
* define the properties your component should have and what type they are

Let's show the above in code:

```js
import React, { Component } from 'react';
import PropType from 'prop-types';

class Jedi extends React.Component {
  render() {
    return (
      <div>Name: {this.props.jedi.name}</div>
    );
  }
}

// 1. declaring the types it consists of
Jedi.propTypes = {
  jedi : PropType.shape({
    name: PropType.string.isRequired,
  })
};

class App extends Component {
  render() {
    return (
      <div>

      <!-- 2. Giving it BAD input on purpose -->
      <Jedi jedi={{ title: 'Vader' }} />

      {jedis.map( jedi => <Jedi jedi={jedi} />)}
      </div>
    );
  }
}

export default App;
```

What've done above is to import the prop-types, like so:

```js
import PropType from 'prop-types';
```

Thereafter we extended our component by assigning an object propTypes to it, like so:

```js
Jedi.propTypes = {
  jedi : PropType.shape({
    name: PropType.string.isRequired,
  })
};
```

Above we are saying that the property jedi is a complex shape that consist of a name property.

Below in our markup we are provoking an error by creating a Jedi component and giving it an object that does NOT fullfil the requirements we have on it:

```html
<!-- 2. Giving it BAD input on purpose -->
<Jedi jedi={{ title: 'Vader' }} />
```

This produces the following error in our console:

**index.js:2178 Warning: Failed prop type: The prop \`jedi.name\` is marked as required in \`Jedi\`, but its value is \`undefined\`.**

** in Jedi \(at App.js:33\)**

** in App \(at index.js:7\)**

The reason we get the above error message is that we provide an object with the property `title` instead of `name`. If we were to change the above to the following, the error would disappear:

```html
<Jedi jedi={{ name: 'Vader' }} />
```

### Best practice

It is considered best practice to use this lib. It is further considered a best practice to mark up every single input with a specific type. Also it's considered a better practice to move in the propTypes as member of the class, like so:

```js
class Jedi extends React.Component {
  static propTypes = {
    jedi : PropType.shape({
      name: PropType.string.isRequired,
    })
  };

  render() {
    return (
      <div>Name: {this.props.jedi.name}</div>
    );
  }
}
```

## Summary

We introduce props. They are the way we are able to pass data into a component. We have learned the following:

* We simply declare them as attribute on our React element when we want to pass in something `<Elem attr={data}>`
* We can pass in object or a list, both works
* We should use the library prop-types to ensure our component get the data they expect so we can capture errors early