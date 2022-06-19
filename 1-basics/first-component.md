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

> [![Create React component video](https://img.youtube.com/vi/0MZ2MkPCk1Q/0.jpg)](https://www.youtube.com/watch?v=0MZ2MkPCk1Q)
> 
> Check out the video for the below steps

We will do the following:

- **Define the component**, this will involve us inheriting from `React.Component` and define the method `render()`.

- **Use the component in our app**. You will see how you can add the component to your app.

### -0- Create project

1. Create a new project by running the below command:

   ```console
   npx create-snowpack-app app --template @snowpack/app-template-minimal
   ```

1. Run `npm install` to add the React specific libraries:

   ```console
   npm install react react-dom --save
   ```

1. Rename your entry point file:

   ```console
   mv index.js index.jsx
   ```

1. Add the following content to *index.jsx*:

   ```jsx
   import React from 'react';

   import ReactDOM from 'react-dom';
   ReactDOM.render(
     <div>My app</div>, 
     document.getElementById('root')
   );
   ```

1. Add the following line to *index.html* just above the script tag:

   ```html
   <div id="root"></div>
   ```

1. Run the app with `npm start`

   ```console
   npm start
   ```

   You should now see "My app" at http://localhost:8080. 

   This will create a sub directory *app*.

### -1- Create your first component

1. Create a file *Jedi.jsx*, and give it the following content:

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

1. Open the file *index.js* and add the following row at the top:

   ```javascript
   import Jedi from './Jedi';
   ```

1. Locate the part of the code that says `ReactDOM.render` and change it to look like so:

   ```javascript
   ReactDOM.render(
    <Jedi />,
    document.getElementById('root')
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

1. Locate the *Jedi.js* file and change its content to the following:

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
