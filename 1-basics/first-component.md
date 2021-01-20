# Your first component

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

The most used ways to create a component are:

- **Class based**. A class based component is made up of a class that inherits from `React.Component`.

- **Function based**. Function based component consists of nothing but a function that needs to return JSX.

## What component type to choose

Which type of component do I choose, class based or function based?  

The reason for using a class based component is that you want to use state, function based components used to only be able to render data, not change it. However, since [hooks](../5-advanced/hooks.md) were added you now use function based all the time, so that's my recommendation.

Let's show both types however, if you maintain an older code base, it might not make sense to mix styles and rather stick with the chosen approach.

## Exercise - create a component

We will do the following:

- **Define the component**, this will involve us inheriting from `React.Component` and define the method `render()`.

- **Use the component in our app**. You will see how you can add the component to your app.

### -1- Define the component

1. Create a new project by running the command `git clone`:

   ```bash
   git clone https://github.com/softchris/react-starter-project my-first-app
   cd my-first-app
   ```

   This starter project is based on the tutorial in [Setup with Webpack](./setup.md).

1. Run `npm install` to install all dependencies:

    ```bash
    npm install
    ```

1. In the _src_ directory, add a file `Jedi.js` and give it the following content:

   ```javascript
    import React from 'react';

    class Jedi extends React.Component {
      render() {
        return (
          <div>I am a Jedi Component</div>
        );
      }
    }
    
    export default Jedi;
   ```

   Above we are defining the class `Jedi` and have it inherit from  `React.Component`. Thereafter we define the method `render()` that defines what our component will output. We return a JSX statement as output.

### -2- Use component

Now that we have our component we can easily use it.

1. Open the file _index.js_ and add the following row at the top:

   ```javascript
   import Jedi from './Jedi';
   ```

1. Locate the part of the code that says `ReactDOM.render` and change it to look like so:

   ```javascript
   ReactDOM.render(
      <div>
        <Jedi />
      </div>,
      document.getElementById('app')
    );
   ```

   The `<Jedi>` component has been added to the markup.

1. Test your project by running the following command at the root:

   ```bash
   npm start
   ```

   This should tell you the bundle compiled correctly and that your app runs at **http://localhost:8080**.

1. Open up a browser and navigate to **http://localhost:8080**. You should see the following text on the webpage:

   ```output
   I am a Jedi Component
   ```

   Success!

## Exercise - create a function component

Let's create the other type of component, so you can compare.

1. Locate the _Jedi.js_ file and change its content to the following:

   ```javascript
   import React from 'react';

   const Jedi = () => <div>I am a Jedi Component</div>

   export default Jedi;
   ```

   What you've done is to create component that is just a simple function. What makes it work is that it returns JSX so regardless if you use an arrow function or use the `function` keyword, it needs to return JSX.

1. Run the project with `npm start`:

    ```bash
    npm start
    ```

1. Open up a browser and navigate to **http://localhost:8080**:

   You should see:

    ```output
   I am a Jedi Component
   ```

   Success !
