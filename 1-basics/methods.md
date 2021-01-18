# Methods

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

When you build your component you are going to want to add methods to it. You are going to attach methods to different events such as `submit`, `click`, `change` etc. One thing you need to keep in mind is that React changes the name and the casing of the event like so:

* click becomes `onClick`
* change becomes `onChange`
* submit becomes `onSubmit`

I think you get the idea.

## Event examples

Let's have a look at how to set up a method to an event:

```js
class Element extends React.Component {
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

## Binding our method to our class

This looks all well and good but it has a problem. You don't see the problem right now cause it does what it is supposed to i.e print clicked in the console. However try do the following modification:

```js
class Element extends React.Component {
  state = {
    str: 'test'
  }

  clicked() {
    console.log('clicked ' + this.state.str);
  }

  render() {
    return (
      <button onClick={this.clicked}></button>
    )
  }
}
```

The above code WILL give out an error as it doesn't know what state is. This is because our **this** points wrong. There are several ways to fix this. Let's look at the first one:

```js
class Element extends React.Component {

  constructor() {
    super();
    this.clicked = this.clicked.bind(this);
  }

  state = {
    str: 'test'
  }

  clicked() {
    console.log('clicked ' + this.state.str);
  }

  render() {
    return (
      <button onClick={this.clicked}></button>
    )
  }
}
```

We are above declaring a constructor and binding our method `clicked()` to the object instance, like so:

```js
constructor() {
  super();
  this.clicked = this.clicked.bind(this);
}
```

### Two other versions of binding the method

At this point our code works again but it doesn't feel all too pretty. Is there a better way? Actually there are two more ways we could solve this:

* invoke our method as a lambda
* declare our method as a field in the class

#### Invoke method as lambda

Let's look at the first mentioned variant:

In this version we use a lambda in the set up in the markup. The code looks like this:

```js
class Element extends React.Component {

  constructor() {
    super();
    this.clicked = this.clicked.bind(this);
  }

  state = {
    str: 'test'
  }

  clicked() {
    console.log('clicked ' + this.state.str);
  }

  render() {
    return (
      <button onClick={() => this.clicked()}></button>
    )
  }
}
```

Let's zoom in to the change:

```js
<button onClick={() => this.clicked()}></button>
```

#### Declare method as a field

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

## The change event

So far we covered the click event and different ways to wire up an event to a class. The last bit is important to get right or your code will be riddled with runtime errors. Now let's look at more events namely the `change` event. This event is interesting to capture when we are dealing with input fields. It is a way for us to keep track of what the input fields value is at a given point before we for example press a button to submit the value. The code looks like the following:

```js
class Element extends React.Component {

  state = {
    str: 'test'
  }

  changed = (evt) => {
    this.setState({
      str: evt.target.value
    });
  }

  clicked = () => {
    console.log('current value of the input', this.state.str);
  }

  render() {
    return (
      <React.Fragment>
        <input onChange={this.changed} placeholder="some value" >
        <button onClick={this.clicked}>Save</button>
      </React.Fragment>
    )
  }
}
```

Above we are hooking up the `onChange` event to the `changed()` method. In the `changed()` method we are setting the state every time the `onChange` is invoked, which is on every key up. Once we press our button we then read from our `state.str` and we can see that the latest value of our input field is being printed out.