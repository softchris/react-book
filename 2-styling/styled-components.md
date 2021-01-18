# Styled components

> the styling library for your React apps you don’t want to be without

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

![](https://miro.medium.com/max/1400/1*6LTIW-LlQA6blkqums6V3g.jpeg)

There are a ton of ways to style components in React. This is probably my favorite way of doing it and it differs somewhat conceptually from other ways of styling.

## The case for the styled components approach

When you start out styling your React components you may opt for defining CSS classes and assigning them to each element, like so:

```html
<div className=”card”>
  <div className=”card-header”>
    <h3>{card.header}</h3>
  </div>
  <div className=”content”>{card.content}</div>
</div>
```

There is really nothing wrong with the above, it is a viable approach even though some of you might think that’s a lot of repeated typing of the word `className`.

You can argue at this point that I can create a component for the card, the card header and the card content respectively. Yes, we can do that. Then it might look like this instead:

```jsx
<card header={card.header}>
  {card.content}
</card>
```

Now, this example may be a bit trivial and it might be a piece of cake to make such a component. Also, we all know how dead easy it is to create components in React.

So what you need to ask yourself is do I really need a component for that, when all I want to do is add some CSS styling and name my HTML element what I please? If this is where your thoughts are heading then maybe `styled-components` library might be for you?

## Installing and setting up styled-components
We can simply install styled-components via NPM, like so:

```
yarn add styled-components
// OR
npm install — save styled-components
```

After this, we are ready to go and use it in our React project.

## Our first styling
The example the homepage for this library uses is that of buttons. You might end up creating different buttons meant for different purposes in your app. You might have default buttons, primary buttons, disabled buttons and so on. Styled components lib enable you to keep all that CSS in one place. Let’s start off by importing it:

```
import styled from ‘styled-components’;
```

Now to use it we need to use double back ticks `` ` ``, like so:

```
const Button = styled.button``;
```

At this point, we don’t have anything that works bit it shows you the syntax.

As we can see above we call 

```
styled.nameOfElement`` 
```

to define a style for our element. Let’s add some style to it:

```css
const Button = styled.button`
  background: black;
  color: white;
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }
`;
```

What we can see from the above example is that we are able to use normal CSS properties in combination with pseudo selectors like `:disabled` and `:hover`.

If we want to use our Button as part of our JSX we can simply do so, like so:

```jsx
<div>
  <Button>
    press me
  </Button>
</div>
```

We can intermix our `Button` with all the HTML or JSX that we want and we can treat it just like the HTML element `button`, because it is one, just with some added CSS styling.

### Using attributes

The `styled-component` library can apply styles conditionally by looking for the occurrence of a specified attribute on our element. We can use existing attributes as well as custom ones that we make up.

Below we have an example of defining a `primary` button. What do we mean with `primary` versus a `normal` button? Well in an application we have all sorts of buttons, normally we have a default button but we have also a primary button, this is the most important button on that page and usually carries out things like saving a form.

It’s a quite common scenario to style a primary button in a different way so we see a difference between such a button and a `normal` button so the user understands the gravity of pushing it.

Let’s now show how we design such a button and showcase the usage of attributes with `styled-components`. We have our styled Button and we can add the attribute `primary`, like so:

```jsx
<Button primary >I am a primary button</Button>
```

Our next step is updating our `Button` definition and write some conditional logic for if this attribute `primary` is present.

We can do so with the following construct:

```css
${props => props.primary && css`
`}
```

We use the `${}` to signal that we are running some conditional logic and we refer to something called `props`. `props` is simply a dictionary containing all the attributes on our element. As you can see above we are saying `props.primary` is to be *truthy*, it is defined in our attributes dictionary. If that is the case then we will apply CSS styling. We can tell the latter from the above code through our use of css function.

Below we use the above construct add some styling that we should only apply if the `primary` attribute is present:

```css
const Button = styled.button`
  background: black;
  color: white;
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }
  ${props => props.primary && css`
    background: green;
    color: white;
  `}
`;
```

Now we have a more full example of how to test for the existence of a particular attribute. Just one note, we said we needed to use the `css` function. This is a function that we find in the `styled-components` namespace and we can, therefore, use it by updating our import statement to look like this:

```js
import styled, { css } from 'styled-components';
```

### Adapting

We’ve shown how we can look at if certain attributes exist but we can also set different values on a property depending on whether an attribute exists.

Let’s have a look at the below code where we change the `border-radius` depending whether a circle attribute is set:

```css
const Button = styled.button`
  background: black;
  color: white;
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }
  ${props => props.primary && css`
    background: green;
    color: white;
  `}
  border-radius: ${props => (props.round ? ‘50%’ : ‘7px’)}
`;
```

The interesting bit of the code is this:

```css
border-radius: ${props => (props.round ? ‘50%’ : ‘7px’)}
```

We can trigger the above code to be rendered by declaring our Button like so:

```jsx
<Button round >Round</Button>
```

## Styling an existing component

This one is great for styling 3rd party components or one of your own components. Imagine you have the following components:

```js
// Text.js

import React from ‘react’;
import PropTypes from ‘prop-types’;

const Text = ({ text }) => (
  <div> Here is text: {text}</div>
);
Text.propTypes = {
  text: PropTypes.string,
  className: PropTypes.any,
};
export default Text;
```

Now to style this one we need to use the styled function in a little different way. Instead of typing 

```
styled`` 
```

we need to call it like a function with the component as a parameter like so:

```js
const DecoratedText = styled(Text)`
  // define styles
`;
<DecoratedText text={“I am now decorated”} />
```

In the component we need to take the `className` as a parameter in the `props` and assign that to our top-level div, like so:

```js
// Text.js
import React from ‘react’;
import PropTypes from ‘prop-types’;

const Text = ({ text, className }) => (
  <div className={className}> Here is text: {text}</div>
);
Text.propTypes = {
  text: PropTypes.string,
  className: PropTypes.any,
};
export default Text;
```

As you can see above calling the `styled()` function means that it under the hood produces a `className` that it injects into our component that we need to set to our top-level element, for it to take effect.

### Inheritance

We can easily take an existing style and add to it by using the method `extend`, like so:

```js
const GiantButton = Button.extend`
  font-size: 48px;
`;
```

## Change Styled components

In some cases, you might want to apply the style intended for a specific type of element and have that applied to another type of element. A common example is a button. You might like all the styling a specific button comes with but you might want to apply that on an anchor element instead. Using the `withComponent()` method allows you to do just that:

```js
const LinkButton = Button.withComponent('a');
```

The end result of the above operation is an anchor,`a` tag with all the styling of a Button.

## Using the attribute function

Sometimes all you need is just to change a small thing in the component styling. For that the `attrs()` function allows you to add a property with a value. Let’s illustrate how we can add this:

```js
const FramedText = styled(Text).attrs({ title: ‘framed’ })`
  border: solid 2px black;
  color: blue;
  font-size: 16px;
  padding: 30px;
`;
```

Above we have chained `styled()` and `attrs()` and we end with a double `` ` `` tick. Another example is:

```js
const Button = styled.button.attrs({ title: ‘titled’ })`
  background: black;
  color: white;
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    box-shadow: 0 0 10px yellow;
  }
  ${props => props.primary && css`
    background: green;
    color: white;
  `}
  border-radius: ${props => (props.round ? ‘50%’ : ‘7px’)}
`;
```

## Theming

Styled components exports a `ThemeProvider` that allows us to easily theme our styled components. To make it work we need to do the following:
- **import** the ThemeProvider
- **set** it as root Element of the App
- **define** a theme
- **refer** to a property in theme and set that to a desired CSS property

### Set up

In the component where we intend to use a `Theme`, we need to import and declare a `ThemeProvider`. Now this can be either the root element of the entire app or the component you are in. `ThemeProvider` will inject a `theme` property inside of either all components or from the component you add it to and all its children. Let’s look at how to add it globally:

```jsx
ReactDOM.render(
  <ThemeProvider theme={{ color: ‘white’, bgcolor: ‘red’ }}>
    <App />
  </ThemeProvider>,
  document.getElementById(‘root’),
);
```

Now we are ready to change our components accordingly to start using the theme we set out.

Let’s take the Button component that we defined and have it use our theme, like so:

```js
const Button = styled.button.attrs({ title: ‘titled’ })`
  background: ${props => props.theme.bgcolor};
  color: ${props => props.theme.color};
  border-radius: 7px;
  padding: 20px;
  margin: 10px;
  font-size: 16px;
  :disabled {
    opacity: 0.4;
  }
  :hover {
   box-shadow: 0 0 10px yellow;
  }
  ${props => props.primary && css`
    background: green;
    color: white;
  `}
  border-radius: ${props => (props.round ? ‘50%’ : ‘7px’)}
`;
```

Let’s zoom in on what we did:

```css
background: ${props => props.theme.bgcolor};
color: ${props => props.theme.color};
```

As you can see we are able to access the themes property by writing `props.theme.[nameOfThemeProperty]`.

### Theme as a higher order component factory

If we want to use the theme inside of a component we can do so but we need to use a helper called `withTheme()`. It takes a component and the theme property to it, like so:

```js
import { withTheme } from 'styled-components';

class TextComponent extends React.Component {
  render() {
    console.log('theme ', this.props.theme);
  }
}
export default withTheme(TextComponent);
```

## Summary

We have introduced a new way of styling our components by using the `styled-components` library.

We’ve also learned that we get a more semantic looking DOM declaration of our components when we compare it to the classical way of styling using `className` and assigning said property CSS classes.

### Further reading
The official documentation provides some excellent example of how to further build out your knowledge [styled-components official documentation](https://www.styled-components.com/)

Hopefully, this has convinced you that this is a good way of styling your React components. Since I found this library this is all I ever use, but that’s me, you do you :)