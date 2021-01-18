# Conditional rendering

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

Conditional rendering is about deciding what to render given a value of a variable. There are different approaches we can have here:

* render if true
* ternary expression

## Render if true

Let's have a look at the first version:

```js
class Element extends React.Component {
  state = {
    show: false
  };

  const toggle = () => {
    this.setState({
      show: this.state.show
    });
  }

  render() {
    return (
      <React.Fragment>
        <div>some data</div>
        {this.state.show &&
        <div>body content</div>
        }
        <button onClick={this.toggle}></button>
      </React.Fragment>
    );
  }
}
```

Above we can see that look at the variable show in our state and renders a div if show is truthy:

```js
{ this.state.show &&
  <div>body content</div>
}
```

## Ternary rendering

In this version we define a ternary expression and render different things depending on the value of our variable:

```js
class Element extends React.Component {
  state = {
    loading: false,
    data: void 0
  };

  const toggle = () => {
    this.setState({
      show: this.state.show
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loading ?
        <div>loading...</div> :
        <div>{this.state.data}</div>
        }
      </React.Fragment>
    );
  }
}
```

Let's highlight the ternary expression:

```js
{ this.state.loading ?
<div>loading...</div> :
<div>{this.state.data}</div>
}
```

## Using if, else if, else

And of course it is possible to use normal `if`, `else if`, `else` clauses when rendering, like so:

```js
class Element extends React.Component {
  state = {
    loading: false,
    data: void 0
  };

  const toggle = () => {
    this.setState({
      show: this.state.show
    });
  }

  const click = () => {
    this.setState({
      loading: true
    });
  }

  getData() {
    if (this.state.loading) {
      return <div>loading...</div>;
    } else if(this.state.data) {
      return <div>{this.state.data}</div>;
    }
    return <div>{this.state.data}</div>;
  }

  render() {
    return (
      <React.Fragment>
        <div>something</div>
        { this.getData() }
      </React.Fragment>
    );
  }
}
```

We can't use `if`, `else if` and so on directly in the template but we can have a method `getData()` that can decide for us what ot render out. Let's highlight what we did above, define a getData\(\) method with conditional rendering:

```js
getData() {
  if (this.state.loading) {
    return <div>loading...</div>;
  } else if(this.state.data) {
    return <div>{this.state.data}</div>;
  }
  return <div>{this.state.data}</div>;
}
```

and calling it in the template like so:

```js
{ this.getData() }
```