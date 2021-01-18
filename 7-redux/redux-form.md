# Redux Form

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

`redux-form` is a library that makes it easier to handle forms and make them fit into the Redux system. Let's discuss briefly how we normally approach Forms without using this library. Our approach is usually this:

```js
state = {
  value: ''
}

onSubmit = (evt) => {
  // check the values, if ok, submit
}

onChange = (evt) => {
  this.setState({
    input: evt.target.value
  });
}

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <input onChange={this.onChange} value={this.state.value}>
        </div>
      </form>
    )
  }
```

Above we show a few things we need to do work with forms, which is

* keep track of when the value of inputs change, using `onChange`
* respond to a submit, using `onSubmit`

There are other things we want to keep track of in a form like:

* validating input, this is a big topic as it could be everything from checking wether an input is there at all or matching some pattern or may even need to check on server side wether something validates or not
* check if its pristine, untouched, if so no need to validate and definitely we shouldn't allow a submit to happen

Here is the good news, Redux Form library helps us with all these things, so let's show the awesomeness of this library in this chapter.

## Install and Set up

Installing it is as easy as typing:

```
yarn add redux-form
```

I'm assuming you already typed:

```
yarn add redux, react-redux
```

previously to get React working.

Setting it up is quite easy as well. What we need to do is to add some code in the file where we create the root reducer. I usually create a `store.js` file like so:

```js
// store.js

import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

const reducer = (state = 0, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  value: reducer,
})

export default rootReducer;
```

Above we have we a reducer function called `reducer` that we pass as a parameter to `combineReducers`. We create an association so that the function `reducer` takes care of `value` in the state of our store. To get `redux-form` to work we need to create the value `form` and let a form reducer take care of it like so:

```js
// store.js - excerpt
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

// reducer definition

const rootReducer = combineReducers({
  value: reducer,
  form: formReducer,
});

export default rootReducer;
```

As you can see above we added the following line in our call to `combineReducers`:

```js
form: formReducer
```

and `formReducer` comes from `redux-form` and is something we import, like so:

```js
import { reducer as formReducer } from 'redux-form'
```

That concludes the set up we need to do, onwards to create a form component in our next section.

## Your first redux-form instance

Because this is Redux it means that we need to create the following:

* a container component
* a presentation component

There is a difference though, instead of using a `connect` function, to create our container component, we will be using a function called `reduxForm` to achieve it. Let's create a simple form and turn it into a `redux-form`:

```js
// TodoForm.js - excerpt

import { Field, reduxForm } from 'redux-form';

class TodoForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <Field name="title" component="input" type="text"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

Ok, so now we have our presentation form and as you can see above we are passing a `handleSubmit` function through our `props`. Another thing is the usage of `Field` component that is an abstraction over any type of input that we want to create. In this case we use to create a normal `input` tag but it can be made to represent any type of form field.

Let's turn into a container component. We do that by simply calling `reduxForm`, like so:

```js
// TodoForm.js - excerpt

import { Field, reduxForm } from 'redux-form';

TodoForm = reduxForm({
  form: 'todo' // a unique name for this form
})(TodoForm);
```

Aa you can see above we are calling `reduxForm` with an object that has the property `form` that needs to have a unique value, so we give it the value `todo`. This is so our store can differ between different forms when tracking its values. Let's first have a look at the full file `TodoForm.js` before putting it in use:

```js
// TodoForm.js

import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class TodoForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <Field name="title" component="input" type="text"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

// Decorate the form component
TodoForm = reduxForm({
  form: 'todo' // a unique name for this form
})(TodoForm);

export default TodoForm;
```

At this point let's put this in use. We will create a TodoPage component like so:

```js
// TodoPage.js

import React from 'react';
import TodoForm from './containers/TodoForm';

class TodoPage extends React.Component {
  handle = (values) => {
   // Do something with the form values
    console.log(values);
  }

  render() {
    return (
    <TodoForm onSubmit={this.handle} />
    );
  }
}

export default TodoPage;
```

What we can see above is how we render out the `TodoForm` component and we also assign a function to its property `onSubmit`. Let's have a closer look at the `handle` method of our component:

```js
// TodoPage.js - excerpt

handle = (values) => {
  // Do something with the form values
  console.log(values);
}
```

Worth noting is how our input is the paraneter `values` that is an object representing our form looking like so:

```js
// values: { title: 'the value you typed' }
```

This is where `redux-form` has done its magic, in a normal form the input parameter on an `onSubmit` for a form would be an event instead.

## A more advanced example

Ok, so now you know how to get things set up and have created your first form. This library comes pack with useful functionality so let's have a look at what you can do more.

Let's look at the following properties:

* **pristine**, boolean saying where we interacted with the form at all
* **reset**, function that allows us to reset the form to its previous state
* **submitting**, boolean that determines wether we are submitting

Now back to our `TodoForm.js`, we will try to enhance it a little bit by adding the above properties:

```js
// TodoForm.js
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

class TodoForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    // rest of the form definition
  }
}

// Decorate the form component
TodoForm = reduxForm({
  form: 'todo' // a unique name for this form
})(TodoForm);

export default TodoForm;
```

We have omitted the form definition above to make it easier to see what we are doing. The change consists of digging out `pristine`, `reset` and `submitting` from `props`. Now let's add them to our form markup. Where should we add them though? Well we can `pristine` and `submitting` on our `button` and disable the button if either of those properties are true. It really makes no sense to allow a submit button to be pushed in the middle of submitting or when the user hasn't even interacted with the form. Our markup therefore now looks like so:

```html
<!-- TodoForm.js - excerpt -->
<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="title">Title</label>
    <Field name="title" component="input" type="text" />
  </div>
  <div>
    <label htmlFor="email">Email</label>
    <Field name="email" component="input" type="email" />
  </div>
  <button disabled={ pristine || submitting } type="submit">Submit</button>
</form>
```

Especially look at the following:

```html
<button disabled={ pristine || submitting } type="submit">Submit</button>
```

What about our last property, `reset`. Well this is a functionality that we can assign to a button, like so:

```js
<button onClick={reset} disabled={pristine}>
  Reset
</button>
```

It makes sense to add the `pristine` condition to its `disabled` attribute as there is no point resetting a form that hasn't been interacted with. Our form with some inputs now looks like this:

![](/assets/Screen Shot 2018-06-27 at 14.23.40.png)

Because we started to interact with the form you can see that the reset button is enabled. Pressing reset button however leads to this:

![](/assets/Screen Shot 2018-06-27 at 14.23.49.png)

## Validating the form

Ok so now we know how to set things up, create a form with input fields and even check things like `pristine` and so on. What about validation, validation is usually the topic where we spend the most time implementing? Good news is that validation is pretty simple. It's as simple as:

* writing a validation function, and tell redux-form about it
* customize the rendering of your input field to show validation errors, if any

### Writing a validation function

Let's revisit our `TodoForm.js` file. We need to do the following for this to work:

* provide a property `validate` to the object you give to `reduxForm`, this property should point to a validation function that you need to write
* define a custom input control where you are able to show your input as well as errors, if there are any

Let's start off with the setup:

```js
// TodoForm.js - excerpt

TodoForm = reduxForm({
  form: 'todo',
  validate
})(TodoForm);
```

As you can see above we are adding the property `validate` that points to a function `validate` that we have yet to specify.

> Remember validate: validate can be written as validate in ES6

Next step is defining the `validate` function which we can do like so:

```js
const validate = values => {
}
```

Now what? Well this function is expected to return a dictionary of your errors. The input parameter `values` contain all the field values so if you have a field `title`, `values` will contain:

```
// { title: 'your entered value' }
```

Next up is therefore to implement the function `validate`:

```js
const validate = values => {
const errors = {};

if (!values.title) {
  errors.title = 'title must be entered';
}

return errors;
}
```

Above we have now defined the `validate` function. We go through the `values` input parameter which is an object containing all of our field values. If we find that a certain values isn't what it should be, like:

* not existing
* not conforming to a pattern
then we create an entry in the dictionary `errors` with an error message. The method `validate` will be invoked on each `keyup` event. Ok now we have everything set up and we are ready to move on to the next bit which is how do we display errors?

### Customize an input

We have been using `Field` as the component that represents an input. So far we have set an attribute `component` like so:

```html
<Field name="title" component="input" />
```

We can give `component` a function as an argument instead of a string. This means that we decide what gets rendered. Let's specify such a function:

```js
const renderField = ({
  input,
  label,
  type,
  meta: { touched, error }
}) => {
return (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
      ((error && <Error>{error}</Error>))}
    </div>
  </div>
  )
}
```

What we see above is that `renderField` is function that takes an object as a parameter and expects us to return a markup. Looking a little deeper at the input parameter we see that we have the following interesting bits:

* **input**, this is our input value
* **label**, this is a text label
* **type**, the type of input, given the value of this we an choose to render different types of input components
* **meta**, this is an object containing interesting information on the state of our input, if it has been interacted with, if it has an error and so on.

Having a look at the markup, we see that we can lay out this input parameters to create a nice looking input and a suitable place for our validation error:

```js
(
<div>
  <label>{label}</label>
  <div>
    <input {...input} placeholder={label} type={type} />
    {touched &&
    ((error && <Error>{error}</Error>))}
  </div>
</div>
)
```

Note, that we look on the property `touched`, which means if we interacted with the element and based on it being in that state then we display the error:

```js
{touched & ((error && <Error>{error}</Error>))}
```

Lastly we need to instruct our `Field` component to use this function, like so:

```js
<Field name="title" component={renderField} />
```

### Finishing up

We have defined our validation function. We have defined a function that let's create our own representation of an input. Putting it all together our `TodoForm.js` should now look like this:

```js
// TodoForm.js

import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';

const Error = styled.div`
  color: red;
  font-weight: bold;
  margin: 5px;
  padding: 10px;
  margin-top: 0px;
`;

const FormContainer = styled.div`
  margin: 20px;
  box-shadow: 0 0 5px grey;
  padding: 20px;

  input {
  border: solid 1px grey;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  }

  button {
    border: solid 1px grey
  }
`;

const validate = (values) => {
  const errors = {};

  if(!values.title) {
    errors.title ="title is required";
  }

  return errors;
}

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error }
}) => {
  return (
    <div>
      <label>{label}</label>
      <div>
        <input {...input} placeholder={label} type={type} />
        {touched &&
        ((error && <Error>{error}</Error>))}
      </div>
    </div>
  )
}

class TodoForm extends Component {
  render() {
    const { handleSubmit, pristine, submitting, reset } = this.props;
    
    return (
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
          </div>
          <div>
            <Field name="title" component={renderField} type="text"/>
          </div>
          <div>
            <label htmlFor="email">Email</label>
          </div>
          <div>
            <Field name="email" component="input" type="email"/>
          </div>
          <button onClick={reset} disabled={ pristine } type="submit">Reset</button>
          <button disabled={ pristine || submitting } type="submit">Submit</button>
        </form>
      </FormContainer>
    );
  }
}

// Decorate the form component
TodoForm = reduxForm({
  form: 'todo',
  validate
})(TodoForm);

export default TodoForm;
```

## Further reading

There is a lot more to this wonderful library. Have a look at the official docs for more advanced scenarios 

[Official docs](https://redux-form.com/7.4.2/)

