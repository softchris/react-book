# Inline styling

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

React has a different take on styling. You can definitely set a style tag with content. However, what you set to it needs to be an object with properties in it and the properties needs to have pascal casing. Let's show how this can look:

```js
import image from './image.jpg';

const styles = {
  color: 'red',
  backgroundImage: `url(${url})`
};

class TestComponent extends React.Component {
  render() {
    return (
    <div style={styles}>style this</div>
    );
  }
}
```

Note the use of `backgroundImage` we have to write it like that rather than `background-image`.

## Working with CSS files

We can of course work with normal CSS files. We can define our styles in there and just import the file, like so:

```css
// App.css

.container {
  font-size: 16px;
  border: solid 1px black;
}
```

To use it we simply do an `import`, like so:

```js
import './App.css';

class TestComponent {
  render() {
    return (
    <div className={container}></div>
    );
  }
}

```

Note in the above code that we are using the attribute `className` to set a CSS class. By using the `import` above our component can now freely use the CSS specified in `App.css`.