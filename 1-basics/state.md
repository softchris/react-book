# Dealing with state

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

State is how we can change the data inside of a component. In the former section we covered props, [Props](/props.md) . Props are great but they lack the ability to be changed in the component they are added in. Let's look at the following example so you understand what I mean:

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Element extends React.Component {
  static propTypes = {
    name: PropTypes.string
  }

  // THIS WON'T WORK
  changeName() {
    this.props.name = 'new name';
  }

  render() {
    return (
      <div>{this.props.name}</div>
      <button onClick={() => this.changeName()} ></button>
    )
  }
}

// usage

let person = { name: 'chris' }

<Element name={person.name} />
```

In the above example we try to change the name property but React won't let us do that. Instead we need to rely on state to do so.

## Creating the state

There are two ways we can create the state:

* declare it in the constructor
* create it as inline field in the class

The first way looks like this:

```js
class Element extends React.Component {
  constructor() {
    this.state = {
      field : 'some value'
    }
  }
}
```

The second way looks like this:

```js
class Element extends React.Component {
  state = {
    field : 'some value'
  }
}
```

## Accessing the state

Accessing the state is as simple as calling `this.state.property`. If you want to be more elegant you can use destructuring like so:

```js
  render() {
  // DESTRUCTURING
    const { name } = this.props;

    return (
      <div>{name}</div>
      <button onClick={() => this.changeName()} >Change name</button>
    )
  }
```

## Changing the state

To change our state we need to call the `setState()` method and provide it the slice of change we want to change here:

```js
this.setState({
  name: 'new name'
})
```

One important thing to know though. If the state object is way bigger than that, like so:

```js
state = {
  name : '',
  products: []
}
```

Only the part you refer to in `setState()` will be affected.

## Rewriting our example to use state

Let's rewrite the above to instead use state:

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Element extends React.Component {
  static propTypes = {
    name: PropTypes.string
  }

  constructor() {
    this.state = {
      name : this.props.name 
    }
  }

  changeName() {
    this.setState({
      name: 'new name'
    })
  }

  render() {
    return (
      <div>{this.props.name}</div>
      <button onClick={() => this.changeName()} >Change name</button>
    )
  }
}

// usage

let person = { name: 'chris' }

<Element name={person.name} />
```

Above we are now using the state functionality so we can change the value. We are however creating a copy of the props value in the constructor :

```js
constructor() {
  this.state = {
    name : this.props.name
  }
}
```

## Listen to the change

Changing the the state with `setState()` doesn't happen there and then, it takes a little time. So doing something like this may lead to buggy code:

```js
someMethod() {
  this.setState({
    name : 'some value'
  });

  if(this.state.name === 'some value') {
    // do something
  }
}
```

It's usually better to wait until you are in the `render()` method and then do your comparison, like so:

```js
import React, { Component } from 'react';

class Element extends React.Component {

  constructor() {
    this.state = {
      show : false
    }
  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    })
  }

  render() {
    return (
      <div>Element</div>

      // better to access the state here, when it has its new value we act accordingly
      { this.state.show &&
      <div>show this..</div>
      }
      <button onClick={() => this.toggleShow()} >Toggle</button>
    )
  }
}

// usage

<Element />
```

If you really want to know exactly when the change in the state happens, you can provide a callback to `setState()`, like so:

```js
someMethod() {

  this.setState({
    name : 'some value'
  }, () => {
    // state changed here
    if (this.state.name === 'some value') {
      // do something
    }
  });
}
```