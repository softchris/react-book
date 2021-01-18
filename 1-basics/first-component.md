# Your first component

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

There are many ways to create a component but let's have a look at how you can create a so called class based component.

We will do the following:
- **Define** the component, this will involve us inheriting from `React.Component` and define the method `render()`
- **Use** the component in our app.

 We use JSX to define it and assign it to a variable. Thereafter we are free to use it in our markup. To create our component we need the following:

## Define the component

Let's begin by creating a Jedi component:

```js
class Jedi extends React.Component {
  render() {
    return (
      <div>I am a Jedi Component</div>
    );
  }
}
```

Above we are defining the class `Jedi` and have it inherit from  `React.Component`. Thereafter we define the method `render()` that defines what our component will output. We return a JSX statement as output.

## Use component

Now that we have our component we can easily it as we would any HTML element like below `<Jedi />`:

```html
<div>
  <Jedi />
</div>
```

## Create a React application

> Ok, great I know how to create a Component but how do I actually create a React app? 

That's a fair comment. 

To create a React app we will opt to use the `script` version of creating a React project. This involves creating thee following files:

- **index.html**, this will contain the script tags pointing to the needed React libraries but also a mount point for our app.
- **app.js**, this will contain the application definition

### Create `index.html`

```html
<!-- index.html ->

<html>
  <body>
  <!-- This is where our app will live -->
    <div id="app"></div>

    <!-- These are script tags we need for React, JSX and ES2015 features -->
    <script src="https://fb.me/react-15.0.0.js"></script>
    <script src="https://fb.me/react-dom-15.0.0.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script>
    <script type="text/babel" src="app.js"></script>
  </body>

</html>
```

Above we create the mount point `<div id="app"></div>`, this is where our app will be rendered.

### Create `app.js`

`app.js` looks like the following:

```js
class Jedi extends React.Component {
  render() {
    return (
      <div>I am a Jedi Component</div>
    );
  }
}

class Application extends React.Component {
  render() {
    return (
      <div>
        <Jedi />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
```

The above has three parts:

1. **Component definition**, We define our `Jedi` component. 
2. **Application definition**, this where we create the component `Application` and within its `render()` method we place the `Jedi` component
3. **Render the app**, our last line is us  calling `ReactDOM.render()` with the `Application` component and as second argument we tell it where to find the mount point. In our case this is the `div` with id `app`