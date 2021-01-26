# Forms

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

The default behavior when submitting a form is form to post the result and move on to another page. Your markup usually looks like so:

```js
<Form>
  <input type="text" name="name" id="name" />
  <button>Submit</button>
</Form>
```

## Controlled components
In React however you tend to want to control Forms a bit more. You usually wants to:

- verify a form is a valid before being submitted
- give error message on input field before submitting so you can correct the answer
You can verify a forms validity by listening to `onSubmit()` method. That will give you the form as input and you are able to inspect and determine wether the forms data should be persisted. It will look like this:

```js
class App extends Component {
  onSubmit = (ev) => {
    console.log('form', ev.target);
    const { name } = ev.target;
    // value
    console.log('name field', name);
    return false;
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <input name="name" id="name" />
          <button>Save</button>
        </form>
      </div>
    );
  }
}
```
### Single source of truth
The form itself maintains the state of all its input fields but you tend to want to control that and make React the single source of truth. We can do that by putting each element value in the state, like so:

```js
class App extends Component {
  state = {
    firstname: void 0,
  }

  onSubmit = (ev) => {
    console.log('form', ev.target);
    return false;
  }

  handleChange = (ev) => {
    this.setState({
      firstname: ev.target.value,
    });
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.onSubmit}>
          <div>
            <label>First name</label>
            <input name="firstname" id="firstname" value={this.state.firstname} onChange={this.handleChange} />
            {this.state.firstname}
          </div>
          <div>
            <button>Save</button>
          </div>
        </form>
      </div>
    );
  }
}
```
Above we are creating the method `handleChange()` that reacts every time the `change` event is triggered. We can see that we subscribe to `change` event when we connect the `handleChange()` method to the `onChange`, like so:

```js
<input name="firstname"
  id="firstname"
  value={this.state.firstname}
  onChange={this.handleChange}
/>
```

### Adding more input elements
So far we have seen how we can add an input element and hook up a method to `onChange` and stick the value of the element into the state object. Does this means we will have 20 different methods if we have 20 different inputs? No, we can solve this in an elegant way:

```js
class App extends Component {
  state = {
    firstname: void 0,
    lastname: void 0,
  }

  onSubmit = (ev) => {
    console.log('form', ev.target);
    return false;
  }

  handleChange = (ev) => {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }

  render() {
    return (
    <div className="App">
      <form onSubmit={this.onSubmit}>
        <div>
          <label>First name</label>
          <input name="firstname" id="firstname" value={this.state.firstname} onChange={this.handleChange} />
          {this.state.firstname}
        </div>
        <div>
          <label>Last name</label>
          <input name="lastname" id="lastname" value={this.state.lastname} onChange={this.handleChange} />
          {this.state.lastname}
        </div>
        <div>
          <button>Save</button>
        </div>
      </form>
    </div>
    );
  }
}
```
Let's zoom in on the interesting part:

```js
handleChange = (ev) => {
  this.setState({
    [ev.target.name]: ev.target.value,
  });
}
```

We replaced setting a specific key by name, `firstname` in this case, to a more generic variant `[ev.target.name]`. This will enable us to hook up the `handleChange()` method to any input of the same type.

### Radio buttons and check boxes
Radio button usually have the behaviour that we want one radio button out of many selected. To accomplish that we ensure all radio buttons that belong together have the same name. We therefore create a markup looking like this:

```js
<div>
  Man <input type="radio" name="weather" value="sunshine" onChange={this.handleChange} />
  Woman <input type="radio" name="weather" value="rain" onChange={this.handleChange} />
</div>
```
As we can see above we can easily attach the `handleChanged()` method to the `onChange`.

What about check boxes? Well for checkboxes you can select several different ones, if you check a checkbox then a checkbox of the same group shouldn't be deselected, unlike a radio button. Checkboxes are a little bit different in nature as they require us to look at the property `checked` instead of value. Let's have a look at their markup:
```js
<div>
  Yellow <input type="checkbox" name="yellow" id="yellow" value={this.state.yellow} onChange={this.handleChange} />
</div>
<div>
  Blue <input type="checkbox" name="blue" id="blue" value={this.state.blue} onChange={this.handleChange} />
</div>
<div>
  Red <input type="checkbox" name="red" id="red" value={this.state.red} onChange={this.handleChange} />
</div>
```

As mentioned we need to look at the property `checked`, this means we need to alter the method `handleChange()` slightly, to this:

```js
handleChange = (ev) => {
  const value = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value;

  this.setState({
    [ev.target.name]: value,
  });
}
```

From the above code we see that we inspect to see wether `target.type` is of type `checkbox`, if so we look at the `checked` property to find our value.

### Select list
Select lists are quite easy, we can construct those using a `select` tag and many `option` tags, like so:

```js
{this.state.products.length > 0 &&
  <select name="product" onChange={this.handleChange}>
    {this.state.products.map(p => (
      <option selected={this.state.product === p} value={p}>{p}</option>
    ))}
  </select>
}
```

Above we simply repeat out a list of products and set the `value` property and the inner HTML of the `option` element. We also set the `selected` property if our `this.state.product` corresponds to the rendered out element.
