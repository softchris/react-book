# Forms II - validation

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

Validating forms can be done in different ways:

- Validate an element as soon as you type, and immediately indicate any error
- Validate the form on pressing submit

## Validate an element

You can have all the elements and their validation in one giant component but it is usually better to create a dedicated component for this. A component like this should have the following:

- render the element itself, this will give us more control over how the element is rendered
- an element where you can output the validation error
- a way to listen to changes and validate itself while the user types
- a way to indicate to the form that it is no longer valid should a validation error occur

### Render the element

With this one we mean that we need to create a component around our element. To do so is quite simple:

```js
import React from 'react';

class Input extends React.Component {
  render() {
    return (
    <input { ...this.props} />
    );
  }
}
```
As you can see above we make the `Input` component render an `input` element tag. We also ensure that all properties set on the component make it to the underlying input by typing `{ ...this.props}`. A more manual version of the last one would be to type:

```
<input title={this.props.title} value={this.props.value} ... >
```
Depending on how many attributes we want to send to the underlying input, it could be quite a lot of typing.

As we are now in control of how the `input` is rendered we can do all sorts of things like adding a `div` element, give it padding, margin, borders etc. Best part is we can reuse this component in a lot of places and all of our inputs will look nice and consistent.

### Adding validation

Now we will see that it pays off to wrap our `input` element in a component. Adding validation to our element is as easy as:

- add element placeholder where your error should be shown
- add a function that validates the input value
- validate on every value change, we need to add a callback to `onChange`

#### Render the error
Alter the `render()` method to the below:

```js
render() {
  return (
    <InputContainer>
      {this.state.error &&
      <ErrorMessage>{this.state.error}</ErrorMessage>
      }
      <div>
      {this.props.desc}
      </div>
      <InnerInput value={this.state.data} onChange={this.handleChange} {...this.props} />
    </InputContainer>
  );
}
```

Here we are conditionally displaying the error message, assuming its on the state:

```js
{this.state.error &&
  <ErrorMessage>{this.state.error}</ErrorMessage>
}
```
We are also hooking up a `handleChange()` method to `onChange`.

#### Adding validation function
Next step is adding our validation function:

```js
const validate = (val, errMessage) => {
const valid = /^[0-9]{2,3}$/.test(val);
return valid ? '' : errMessage;
};
```
Our function above simply tests wether our input value matches a RegEx pattern and if so its valid, if not, then we return the error message.

#### Managing the state
So who is calling this function? Well the `handleChange()` method is, like so:

```js
handleChange = (ev) => {
  const { errMessage } = this.props;

  const error = validate(ev.target.value, errMessage);
  this.setState({
    data: ev.target.value,
    error,
  });
}
```

We do two things here, firstly we call `validate()` to see if there was an error and secondly we set the state, which is our value and the error. If the error is an empty string then it is counted as `falsy`. So we can always safely set the error property and any error message would only be visible when it should be visible.

The full code for our component so far looks like this:

```js
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const InnerInput = styled.input`
  font-size: 20px;
`;

const InputContainer = styled.div`
  padding: 20px;
  border: solid 1px grey;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  border: red;
  background: pink;
  color: white;
`;

const validate = (val, errMessage) => {
  const valid = /^[0-9]{2,3}$/.test(val);
  return valid ? '' : errMessage;
};

class Input extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    desc: PropTypes.string,
    errMessage: PropTypes.string,
  };

  state = {
    error: '',
    data: '',
  }

  handleChange = (ev) => {
    const { errMessage, name } = this.props;

    const error = validate(ev.target.value, errMessage);
    
    this.setState({
      data: ev.target.value,
      error,
    });
  }

  render() {
    return (
    <InputContainer>
      {this.state.error &&
      <ErrorMessage>{this.state.error}</ErrorMessage>
      }
      <div>
      {this.props.desc}
      </div>
      <InnerInput value={this.state.data} onChange={this.handleChange} {...this.props} />
    </InputContainer>
    );
  }
}

export default Input;

```

### Telling the form
Usually when you put input elements in a form you want to be able to tell the form that one or more invalid inputs exist and you want the stop the form from being submitted. To do so we need send a message to our form every time a value changes and if there is a validation error, the form will know. To accomplish that we need to do the following:

- add a `notify` input property, this will be a function we can call as soon as we validated the latest change
- call the `notify` function

We there update our `handleChange()` method to now make a call to the `notify()` function that we pass in, like so:

```js
handleChange = (ev) => {
  const { errMessage, name, notify } = this.props;

  const error = validate(ev.target.value, errMessage);

  notify(name, error === '');

  this.setState({
    data: ev.target.value,
    error,
  });
}
```
`notify()` is called with two params, `name` and wether it is valid.

#### Setting up the form

Ok great, we have a way to communicate errors back to the form, what about the form itself, what does it need to do for this to work? It needs the following:
- a method that it can hook up the `notify` property
- determine what to do if one or more elements are invalid, like for example disable the submit button

We decide on creating a dedicated component for our form as well:

```js
import React from 'react';
import styled from 'styled-components';
import Input from './Input';

const FormContainer = styled.form`
border: solid 2px;
padding: 20px;
`;

class Form extends React.Component {
  state = {
    isValid: true,
  }

  notify = (name, isValid) => {
  }

  render() {
    return (
    <FormContainer>
      <div>
        <Input
          errMessage="Must contain 2-3 digits"
          desc="2-3 characters"
          name="first-name"
          notify={this.notify}
          title="I am a custom inbox" />
      </div>
      <button>Submit</button>
    </FormContainer>
    );
  }
}

export default Form;

```
At this point we have hooked up our notify `input` property to a method on our component called `notify()`, like so:

```html
<Input
  errMessage="Must contain 2-3 digits"
  desc="2-3 characters"
  name="first-name"
  notify={this.notify}
  title="I am a custom inbox"
/>
```
As you can see our `notify()` method doesn't do much yet, but it will:

```
notify = (name, isValid) => {}

```

So what do we need to accomplish with a call to `notify()` ? The first thing we need to accomplish is telling the form that one of your inputs is invalid. The other is to set the whole form as invalid. Based on that we define our `notify()` code as the following:

```js
notify = (name, isValid) => {
  this.setState({
    [name]: isValid,
  }, () => {
    this.setState({
      isValid: this.validForm(),
    });
  });
}
```

We see above that we after having updated our state for our input element we set the state for `isValid` and call the method `validForm()` to determine its value. The reason for setting the `isValid` state like this is that `setState()` doesn't happen straight away so it is only in the callback that we can guarantee that it's state has been updated.

`isValid` is the property we will use in the markup to determine wether our form is valid. Let's define the method `validForm()` next:

```js
validForm = () => {
  const keys = Object.keys(this.state);
  
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === 'isValid') { continue; }

    if (!this.state[keys[i]]) {
      return false;
    }
  }

  return true;
}
```

Above we are looping through our state and is looking for wether one of the input elements are invalid. We skip `isValid` as that is not an element state.

#### Determine form state
We have now set everything up to make it easy to indicate wether the form can be submitted or not. We can handle that in two ways:

- disabling the submit button
- let the user press the submit button but stop the submit from going through

If we do the first variant we only need to change the markup to the following:

```js
render() {
  return (
    <FormContainer onSubmit={this.handleSubmit}>
      <div>
        <Input
          errMessage="Must contain 2-3 digits"
          desc="2-3 characters"
          name="first-name"
          notify={this.notify}
          title="I am a custom inbox"
        />
      </div>
      <button disabled={!this.state.isValid}>Submit</button>
    </FormContainer>
  );
}
```
Let's zoom in on the interesting bit:

```
<button disabled={!this.state.isValid}>Submit</button>
```
We read from our `isValid` property and we are to disable our button when we want.

The other version of stopping the submit from going through involves us adding some logic to the method `handleSubmit()`:

```js
handleSubmit = (ev) => {
  ev.preventDefault();
  if (!this.state.isValid) {
    console.log('form is NOT valid');
  } else {
    console.log('valid form')
  }
}
```