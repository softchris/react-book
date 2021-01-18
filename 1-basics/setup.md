# Set up

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

There are many ways to set uup a new React project.

- **Script tags**, it is possible to just use script tags aand point to React, React DOM and Babel.
- **CRA, Create React App**, this tool helps us generate a React project. This is probably the most common set up.
- **Do it yourself**, it's definitely possible to set everything up with a tool like Web pack.

## Script tags

This version is simplest to start with if you are beginner. This enables you to dive straight into React and learn its features.

```js
// app.js

class Application extends React.Component {
  render() {
    return (
      <div>
      App
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
```

```html
// index.html

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

You can easily serve this up by installing for example a module like  `http-server`

```
npm install http-server -g
```

and type:

```bash
http-server -p 5000
```

This will serve the app at `http://localhost:5000`.

The drawbacks to the above approach is that everything is compiled at runtime which is horribly slow but its great for learning React - but please don't put it like this in production.

## create-react-app

`Create React App` is a scaffolder developed by Dan Abramov. With it you are able to scaffold a React application with ease and will get you up and running in no time. 

There are two ways to use it:

1. **Download** the tool first and generate a React project
2. **Use npx** and scaffold it directly

### Download and generate

Download it like so:

```bash
npm install create-react-app -g
```

Scaffolding an app is almost as simple as downloading it:

```bash
create-react-app <My app name>
```

### Use npx

Here you just have one command looking like so:

```bash
npx create-react-app my-app
```

Currently you need Node >= 8.10 and NPM >= 5.6 on your machine.

`create-react-app` is a very active project and can truly help you in the beginning of you learning React and even later. Question is really how much you want to be able to configure your project. When you become skilled enough you may come to a point when you don't need create-react-app, but until that point, it is your friend. You can read more on it in the official documentation, [https://github.com/facebook/create-react-app](https://github.com/facebook/create-react-app)