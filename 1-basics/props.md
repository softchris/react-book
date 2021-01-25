# Introducing props

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

> TLDR; Adding props, or properties to your component means we add attributes to our component element. This means we can pass data from an outer component to an inner component. That data can either be data that we want to render, or a function that we want to invoke.

In this chapter we will cover the following:

- **Passing data**, you will learn to pass data from the outside and render that in the component.
- **Validate**, we will learn to validate our input properties by using the library `PropTypes`

## Rendering a primitive

You can select between class based or a functional component, when you want to just show data. Data is shown by returning JSX. Let's show both versions below.

1. Create a new project by running the command `git clone`:

   ```bash
   git clone https://github.com/softchris/react-starter-project demo-props
   cd demo-props
   ```

   This starter project is based on the tutorial in [Setup with Webpack](./setup.md).

1. Run `npm install` to install all dependencies:

    ```bash
    npm install
    ```

### Class based component

1. Create a file _Product.js_ in the _src_ directory and give it the following content:

   ```js
   import React from 'react';  

   class Product extends React.Component {
      render() {
        return (
          <div>{this.props.data.name}</div>
        );
      }
    }
    export default Product;
    ```

    To use the component, you will need to import it into _index.js_ and define data you can pass into the component.

1. Open _index.js_ and add the following import statement:

   ```javascript
   import Product from './Product';
   ```

1. Next, add the following code, just after the import statements:

   ```javascript
   const product = {
     name: 'Game Console'
   };
   ```

1. Next, locate the part that looks like so:

   ```javascript
   ReactDOM.render(
     <div>{title}</div>,
     document.getElementById('app')
   );
   ```

   and change it to the following code:

   ```javascript
   ReactDOM.render(
    <Product data={product}/>,
    document.getElementById('app')
   );
   ```

1. Try out the app by running `npm start` in the console:

   ```bash
   npm start
   ```

1. Navigate to **http://localhost:8080** in a browser:

   You should see the following output:

   ```output
   Game Console
   ```  

   The output comes from your `Product` component.

   Note how the `Product` element is now being rendered and the `data` property is assigned to with the `product` object.

   In the above code you:

     - **Passed input data**. The `product` object was assigned to the `data` attribute. Note the use of `{}` to pass in the data. It's needed if want to pass something in and you want React to interpret it.
    
     - **Rendered data**. In the `render()` method you _rendered_ the input data by returning it as JSX and by drilling down into it like so:
    
        ```javascript
        this.props.data.name
        ```
    
        thereby you accessed the passed in object and drilled down, to something you could render, the `name` attribute.

### Functional component

You can define it as a functional component instead of class component. To do so:

1. Open _Product.js_ and change the content to the following:

   ```javascript
   import React from 'react';

   const Product = (props) => <div>{props.data.name}</div>

   export default Product;
   ```

   Webpack remcompiles the bundle as soon as you save the file.

1. Go to your existing browser and **http://localhost:8080**:

   ```output
   Game Console
   ``` 

   It still works, great.

   Like the class based component, there's a `props` involved. You need to drill into `props` to find the attribute that your passed in data resides on. `Props` is a parameter being passed into the function, that makes out your component.

## Rendering a list

When you rendered an object, you ended up returning JSX, JSX that was interpolated with input data. Rendering a list is similar, you still need to return JSX but you an use a function like `map()` to iterate through your content.  

1. Create the file _Cart.js_ in the _src_ directory and give it the following content:

    ```js
   import React from 'react';
   import Product from './Product';

    class Cart extends React.Component {
      render() {
        return (
          <div>{this.props.data.map( product => <Product data={product} />)}</div>
        );
      }
    }

    export default Cart;
    ```

   In the above code, your return statement consist of a JSX expression that interpolates `this.props.products` using a `map()` function, like so:

      ```javascript
      {this.props.product.map( product => <Product data={product} />)}
      ```

   For every item in `products`, a JSX statement is being produced. So what you end up with is a list of `<Product>` elements. Note how each `product` instance binds to the `data` property on the `Product` component you created earlier.

1. To use the `Cart` component. Add an import reference to _index.js_, like so:

   ```javascript
   import Cart from './cart';
   ```

   Next, define the data meant for the cart.

1. After the import statements, add the following code:

    ```javascript
    const products = [
      {
        name: 'Game console'
      },
      {
        name: 'Game'
      }
    ]
    ```

1. Locate the part of the code that says:

   ```javascript
   ReactDOM.render(
    <Product data={product}/>,
    document.getElementById('app')
   );
   ```

   and change it to the following code:

   ```javascript
   ReactDOM.render(
    <Cart data={products}/>,
    document.getElementById('app')
   );
   ```

   The app should recompile as soon as you save the file.

1. Navigate to **http://localhost:8080**:

   You should see the following output:

   ```output
   Game console
   Game
   ```

   Success, you've managed to render list content.

## Validate with PropTypes

As our components becomes more and more complicated, we want to ensure we use them correctly. For example, if a component has a certain property set, it should render it. We might even go so far as to convey that if a property is not set you should throw an error. The library `prop-types` helps you to define what properties are a must and helps us define what type they are.

The steps you need to take to use the library are:

- **Download it**, you can download it using npm or yarn.
- **Import it**, install it via npm or yarn.
- **Configure**. define the properties your component should have and what type they are.

1. Download the library by typing the following in a console:

    ```bash
    npm install prop-types
    yarn add prop-types // or this one, depending on if you are using NPM or Yarn
    ```

1. Open up _Product.js_ in our existing project and add the import to the top, like so:

   ```javascript
   import PropType from 'prop-types';
   ```

1. Define the shape of the input by adding this code, just before the export statement:

   ```javascript
   Product.propTypes = {
     data : PropType.shape({
       name: PropType.string.isRequired,
     })
   };
   ```

   What the above says is, there, should be a `data` property set. The value set is an object/shape and should have a `name` property.

1. The full file should now look like so:

   ```javascript
   import React from 'react';
   import PropType from 'prop-types';
    
   const Product = (props) => <div>{props.data.name}</div>
    
   Product.propTypes = {
      data : PropType.shape({
        name: PropType.string.isRequired,
      })
   };
    
   export default Product;
   ```

1. To show your configuration works as it should, open up _index.js_ and locate the following section:

   ```javascript
   const products = [
      {
        name: 'Game console'
      },
      {
        name: 'Game'
      }
    ]
   ```

   and change it to the following:

   ```javascript
   const products = [
      {
        name: 'Game console'
      },
      {
        title: 'Game'
      }
    ]
   ```

   note how the second item has the property `title`. This should make `prop-types` fail. Remember, your instruction said that any data passed to a `Product` element should have a `name` property. By you passing this data to a `Cart` component (that renders `Product` components ), an error should show.

1. Run the command `npm start`:

   ```bash
   npm start
   ```

1. Navigate to **http://localhost:8080** and open up Developer tools. In the console section you should now have a warning saying something like:

    ```output
    react.development.js:220 Warning: Failed prop type: The prop `data.name` is marked as required in `Product`, but its value is `undefined`.
    ```

    Great, your instruction is working. To fix this issue just go to `index.js` and rename that `title` property back to `name`.

### Best practice

It is considered best practice to use this lib. It's further considered a _best practice_ to mark up every single input with a specific type. Also it's considered a better practice to move in the `propTypes` as member of the class, like so:

```js
class Jedi extends React.Component {
  static propTypes = {
    jedi : PropType.shape({
      name: PropType.string.isRequired,
    })
  };

  render() {
    return (
      <div>Name: {this.props.jedi.name}</div>
    );
  }
}
```

## Solution

  👉 [Check out this solution](./solutions/props)

## Summary

You were introduced to props. They are the way we are able to pass data into a component. You have learned the following:

- You declare them as an attribute on your React element when you want to pass in something `<Elem attr={data}>`
- You can pass in object or a list, both works.
- You should use the library `prop-types` to ensure our component get the data they expect so we can capture errors early.