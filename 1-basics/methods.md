# Methods

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

When you build your component you are going to want to add methods to it. You are going to attach methods to different events such as `submit`, `click`, `change` etc. 

## Events in React

One thing you need to keep in mind is that React changes the name and the casing of the event. What happens is that the text **on** is prepended to the event name. Additionally the casing changes name so that event name is capitalized. Essentially think of events in React to look like so:

```bash
on<Event name>
```

Below is a few examples of some common events:

|Event name  |Name in React  |
|-----------|----------------|
|click      | onClick        |
|change     | onChange       |
|submit     | onSubmit       |

Hopefully, you get the idea :)

## Wireup events to event handlers

To _wire up_ an event to an event handler a method, you need the name of the event (the React version of its name) and a function. Here's an example of a wireup with a class-based component:

```javascript
<Component onClick={this.handler}>
```

This process looks slightly different if you are using a class based component or a function based. Let's cover the former first:

```js
class Element extends React.Component {
  constructor(props) {
    super(props);
    this.clicked = this.clicked.bind(this);
  } 

  clicked() {
    console.log('clicked');
  }

  render() {
    return (
      <button onClick={this.clicked}></button>
    )
  }
}
```

Note two points of interest:

- **the constructor**, in the constructor there's a line of code that ensures the method knows what `this` is:

   ```javascript
   this.clicked = this.clicked.bind(this);
   ```

   The reason we need this is when you want to access properties on the component inside of the `clicked()` method. Had your `clicked()` method looked like this:

   ```javascript
   clicked() {
    console.log(this.props.someAttribute);
    
   }
   ```

    the code would have printed the value of `someAttribute`, if it was set at bind time. Had you NOT done the row in the constructor you would have gotten an error.

- **the JSX**. In the JSX part, in the `render()` function, the actual _wire up_ is done:

   ```javascript
   <button onClick={this.clicked}></button>
   ``` 

   Thanks to the row in the constructor, you can now refer to `this.linked`, and you don't have to worry about the value of `this`.

## Class based components, two other versions of binding the method

At this point, your code works using the `handler.bind(this)` like statement. It doesn't feel all too pretty. You will need to do this for every method that you intend to bind to an event.  

Is there a better way? Actually there are two more ways we could solve this:

- **Invoke our method as a lambda**. This approach means you use an arrow function in your JSX handler expression.
- **Declare our method as a field in the class**

### Invoke method as lambda

Let's look at the first mentioned variant. In this version we use a lambda in the set up in the markup. The code looks like so:

```js
class Element extends React.Component {
  constructor() {
    super();
  }

  state = {
    str: 'test'
  }

  clicked(evt) {
    console.log('clicked ' + this.state.str);
  }

  render() {
    return (
      <button onClick={(evt) => this.clicked(evt)}></button>
    )
  }
}
```

Let's zoom in to the change:

```js
<button onClick={(evt) => this.clicked(evt)}></button>
```

The difference from the first variant was that you went from using an expression looking like so:

```javascript
onClick={this.clicked}
```

to looking like so instead:

```javascript
onClick={(evt) => this.clicked(evvt)}
```

With this variant, you can skip the `bind` in the constructor. Additionally, it gives you something else, the ability to pass a value to the event callback. In your example you pass the `evt`, the event object. You can pass more than that, in fact, any custom argument, like in this example:

```javascript
render() {
    return (
      <button onClick={(evt) => this.clicked(evt, 'left')}></button>
      <button onClick={(evt) => this.clicked(evt, 'right')}></button>
      <button onClick={(evt) => this.clicked(evt, 'top')}></button>
      <button onClick={(evt) => this.clicked(evt, 'down')}></button>
    )
  }
```

Above you're passing a string `left`, `right`, `top`, `down`, just to show that this is a great construct if you want to pass data to the event handler.

### Declare method as a field

> This is not part of the ECMAScript standard yet. 

In this version we declare our method a little bit differently:

```js
class Element extends React.Component {

  constructor() {
    super();
    this.clicked = this.clicked.bind(this);
  }

  state = {
    str: 'test'
  }

  clicked = () => {
    console.log('clicked ' + this.state.str);
  }

  render() {
    return (
      <button onClick={this.clicked}></button>
    )
  }
}
```

Notice the difference between declaring the method in the old way, like this:

```js
clicked() {
  console.log('clicked ' + this.state.str);
}
```

Now we instead declare clicked as a field like so:

```js
clicked = () => {
  console.log('clicked ' + this.state.str);
}
```

This is the preferred way of declaring methods on a class.

## Functional component wire up

Wiring up to an event handler in functional component looks slightly different. For one thing, you don't have to worry about the value of `this`. Here's an example:

```javascript
import React from 'react'

const AComponent = (props) => {
  function handler(evt) => {
    console.log('clicked'); 
  }

  return (
    <div>
      <button onClick={handler}></button>
    </div> 
  )
}
export default AComponent;
```

As you can see it's a lot easier to deal wiring up events to handlers in functional components.

## Exercise

1. Create a new project by running the command `git clone`:

   ```bash
   git clone https://github.com/softchris/react-starter-project demo-methods
   cd demo-methods
   ```

   This starter project is based on the tutorial in [Setup with Webpack](./setup.md).

1. Run `npm install` to install all dependencies:

    ```bash
    npm install
    ```

1. In the _src_ directory, create a file `Methods.js` and give it the following content:

   ```javascript
   import React from 'react';

   class Method extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          direction: ''
        }
      }

    changeDirection (evt, direction) {
      this.setState({
        direction
      })
    }

    render() {
        return (<React.Fragment>
          <div>Direction: {this.state.direction}</div>
          <div>
            <button onClick={(evt) => this.changeDirection(evt, 'Top')}>Top</button>
            <button onClick={(evt) => this.changeDirection(evt, 'Left')}>Left</button>
            <button onClick={(evt) => this.changeDirection(evt, 'Right')}>Right</button>
            <button onClick={(evt) => this.changeDirection(evt, 'Bottom')}>Bottom</button>
          </div>
        </React.Fragment>
        )
     }
   }

   export default Method;
   ```

   What you have, is a component that sets up `onClick` event to the handler `changeDirection()`, that is defined on the class component.

1. In the file _index.js_, add the following import statement at the top:

    ```javascript
    import Method from './Method';
    ```

1. Locate the part code that says `ReactDOM.render(` and replace it with:

   ```javascript
   ReactDOM.render(
     <Method />,
     document.getElementById('app')
   );
   ```

1. From the console, start up the app:

   ```bash
   npm start
   ```

1. In a browser, navigate to [http://localhost:8080](http://localhost:8080])

   You should see the direction state at the top. Select any of the four buttons, and ensure the state is updated.

## Solution

  👉 [Check out this solution](./solutions/methods)

## Summary

You were introduced to method and how you could bind them to events. A good practice is to bind the method, that you  mean to use for event handling, in the constructor. There's also the option of using a lambda, that means you can skip the binding and you can additionally pass values to the handler.
