# Set up

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

There are many ways to set up a new React project like:

- **Script tags**, it is possible to just use script tags and point to React, React DOM and Babel.
- **CRA, Create React App**, this tool helps us generate a React project. This is probably the most common set up.
- **Do it yourself**, it's definitely possible to set everything up with a tool like Web pack.

## Script tags

This version is simplest to start with if you are a beginner. It enables you to dive straight into React and learn its features.

### 📌 Create a React project with script tags and CDN.

1. Create a file _app.js_ and give it the following content:

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

1. Next, create a file _index.html_ and give it this content:

    ```html
    <!-- index.html -->
    
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

    You should now have an app with the following files:

    ```output
    -| app.js
    -| index.html
    ```

1. Run `npx http-server -5000` in the terminal:

   ```bash
   npx http-server -p 5000
   ```

   This will serve up your application on `http://localhost:5000`.

1. Navigate to `http://localhost:5000` in your browser, you should see the text **App**.

> The drawbacks to the above approach is that everything is compiled at runtime which is horribly slow but its great for learning React - but please don't put it like this in production.

## create-react-app

Create React App, CRA is a scaffolder developed by Dan Abramov. With it you are able to scaffold a React application with ease and will get you up and running in no time.

### 📌 Create a React project using npx

To scaffold a project using `npx` and Create React App it's just a one liner command.

1. Create a new React project running this command in a terminal:

    ```bash
    npx create-react-app my-app
    ```

   > Currently you need Node >= 8.10 and NPM >= 5.6 on your machine.

1. Navigate to your project

   ```bash
   cd my-app
   ```

1. Run the following command to serve it up:

   ```bash
   yarn start
   ```

   This starts a development server at `http://localhost:3000`.

1. In your browser, navigate to `http://localhost:3000`. You should see the following:

   ![React app](./cra.png)  

`create-react-app` is a very active project and can truly help you in the beginning of you learning React and even later. Question is really how much you want to be able to configure your project. When you become skilled enough you may come to a point when you don't need create-react-app, but until that point, it is your friend. You can read more on it in the official documentation, [https://github.com/facebook/create-react-app](https://github.com/facebook/create-react-app)

## Solution

- For script tag version:

   👉 [Check out script tag project](./solutions/script)

- For Create React app:

   👉 [Check out this solution](./solutions/my-app)
