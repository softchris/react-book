# Use React Testing Library to test component surface

![](https://thepracticaldev.s3.amazonaws.com/i/s9tm2qojfx0smyf6s1h6.jpeg)

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris


> [React Testing Library](https://github.com/kentcdodds/react-testing-library) is a different testing library in that it tests the surface of your component rather than the internals. You can change your components as much as you want as long as they render the data the same way or the React in the same way if you after interactions such as filling in data or pressing a button for example.

This is what the author the library Kent C. Dodds says about it:
> Simple and complete React DOM testing utilities that encourage good testing practices

It's a lightweight solution for testing React components. It provides utility functions on top of `react-dom`. Your tests work on DOM nodes as opposed to React component instances.

In this article we will cover the following:
- **Writing a test**, show how simple it is to write a test, instantiate a component, and assert on it
- **Dealing with events**, we will learn how we can trigger event and assert on the resulting component afterward
- **Asynchronous actions**, we will learn how we can trigger and wait for asynchronous actions to finish
- **Manage input**, we will learn how to send keystrokes to input elements on our components and assert on the result

It's easy to get started, you only need to install `react-testing-library`:

> yarn add react-testing-library

## Writing a test
Let's look at a real scenario and see what we mean. We will create:

- `Todos.js` a component that allows you to render a list of `Todos` and select a specific `Todo item`
- `Todos.test.js`, our test file

Our component code looks like this:

```jsx
// Todos.js
import React from 'react';
import './Todos.css';

const Todos = ({ todos, select, selected }) => (
  <React.Fragment>
  {todos.map(todo => (
    <React.Fragment key={todo.title}>
      <h3 data-testid="item" className={ selected && selected.title === todo.title ? 'selected' :'' }>{todo.title}</h3>
      <div>{todo.description}</div>
      <button onClick={() => select(todo)}>Select</button>
    </React.Fragment>
  ))}
  </React.Fragment>
);
class TodosContainer extends React.Component {
  state = {
    todo: void 0,
  }

  select = (todo) => {
    this.setState({
      todo,
    })
  }

  render() {
    return (
      <Todos { …this.props } select={this.select} selected={this.state.todo} />
    );
  }
}
export default TodosContainer;
```

Now to the test:

```jsx
// Todos.test.js
import {render, fireEvent, wait} from 'react-testing-library';
import 'react-testing-library/cleanup-after-each';
import React from 'react';
import 'jest-dom/extend-expect';
import Todos from '../Todos';

const todos = [
  {
    title: 'todo1'
  },
  {
    title: 'todo2'
  }];

describe('Todos', () => {
  it('finds title', () => {
    const {getByText, getByTestId, container} = render(<Todos todos={todos} />);
  })
});
```

We can see from the above code that we are using some helpers from 
`react-testing-library`:

- **render()**, this will render our component
- **fireEvent**, this will help us trigger things like a click event or change the input data for example
- **wait**, this allows us to wait for an element to appear

Looking at the test itself we see that when we call render we get an object back, and that we destructure 3 values from it:

```jsx
const {getByText, getByTestId, container} = render(<Todos todos={todos} />)
```

and we end up with the following helpers:
- **getByText**, this grabs an element by it's text content
- **getByTestId**, this grabs an element by `data-testid`, so if you have an attribute on your element like so `data-testid="saved"` you would be querying it like so `getByTestId('saved')`
- **container**, the div your component was rendered to

Let's fill in that test:

```js
// Todos.test.js
import {render, fireEvent, wait} from 'react-testing-library';
import React from 'react';
import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';
import Todos from '../Todos';

const todos = [
  {
    title: 'todo1'
  },
  {
    title: 'todo2'
}];

describe('Todos', () => {
  it('finds title', () => {
    const {getByText, getByTestId, container} = render(<Todos todos={todos} />);
    const elem = getByTestId('item');
    expect(elem.innerHTML).toBe('todo1');
  })
});
```

As we can see above, we are able to render our component and query for an h3 element by using the container and the querySelector. Finally, we assert on the text inside the element.

### Handling actions
Let's have a look at our component again. Or rather let's look at an excerpt of it:

```jsx
// excerpt of Todos.js
const Todos = ({ todos, select, selected }) => (
  <React.Fragment>
  {todos.map(todo => (
    <React.Fragment key={todo.title}>
      <h3 className={ selected && selected.title === todo.title ? 'selected' :'' }>{todo.title}</h3>
      <div>{todo.description}</div>
      <button onClick={() => select(todo)}>Select</button>
    </React.Fragment>
  ))}
  </React.Fragment>
);
```

We see above that we try to set the CSS class to `selected` if a todo is selected. The way to get a `todo` selected is to click on it, we can see how we invoke the select method when we click on the button that is rendered, one per item. Let's try to test this out by adding a test:

```js
import {render, fireEvent, wait} from 'react-testing-library'
import React from 'react';
import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import Todos from '../Todos';
const todos = [
  {
    title: 'todo1'
  },
  {
    title: 'todo2'
  }
];

describe('Todos', () => {
  it('finds title', () => {
    const {getByText, getByTestId, container} = render(<Todos todos={todos} />);
    const elem = getByTestId('item');
    expect(elem.innerHTML).toBe('todo1');
  })

  it('select todo', () => {
    const {getByText, getByTestId, container} = render(<Todos todos={todos} />);
    fireEvent.click(getByText('Select'));
    const elem = getByTestId('item');
    expect(elem.classList[0]).toBe('selected');
  })
});
```

Our last newly added test is using the `fireEvent` helper to perform a `click` and we can see that we are using the `getByText` helper to find the button. We again use the container to find and assert on the selected CSS class.

## Asynchronous tests and working with input

We have so far shown you how to render a component, find the resulting elements, and assert on them. We have also shown how you can carry out things like a click on a button. In this section we will show two things:

- Handling input
- Dealing with asynchronous actions

We will build the following:
- **Note.js**, a component that allows us to enter data and save down the results, it will also allow us to fetch data
- **__tests__/Note.js**, the test file

Let's have a look at the component:

```jsx
// Note.js

import React from 'react';

class Note extends React.Component {
  state = {
    content: '',
    saved: '',
  };

  onChange = (evt) => {
    this.setState({
      content: evt.target.value,
    });
    console.log('updating content');
  }

  save = () => {
    this.setState({
      saved: `Saved: ${this.state.content}`,
    });
  }

  load = () => {
    var me = this;

    setTimeout(() => {
      me.setState({
        data: [{ title: 'test' }, { title: 'test2' }]
      })
    }, 3000);
  }

  render() {
    return (
      <React.Fragment>
        <label htmlFor="change">Change text</label>
        <input id="change" placeholder="change text" onChange={this.onChange} />
        <div data-testid="saved">{this.state.saved}</div>
        {this.state.data &&
        <div data-testid="data">
        {this.state.data.map(item => (
          <div className="item" >{item.title}</div>
        ))}
        </div>
       }
       <div>
         <button onClick={this.save}>Save</button>
         <button onClick={this.load}>Load</button>
       </div>
     </React.Fragment>
   );
  }
}

export default Note;
```

### Handling user input
To save data in our sample app, we enter text into an input and press the save button. 

Let's create a test for that:

```js
// __tests__/Note.js
import {render, fireEvent, wait} from 'react-testing-library'
import React from 'react';
import 'jest-dom/extend-expect'
import 'react-testing-library/cleanup-after-each'
import Select from '../Note';

describe('Note', () => {
  it('save text', async() => {
    const {getByText, getByTestId, getByPlaceholderText, container, getByLabelText} = render(<Select />);
    const input = getByLabelText('Change text');
    input.value= 'input text';
    fireEvent.change(input);
    fireEvent.click(getByText('Save'));
    console.log('saved', getByTestId('saved').innerHTML);
    expect(getByTestId('saved')).toHaveTextContent('input text')
  })
});
```

We can see above that we use the helper `getByLabelText` to get a reference to our input and we simply do `input.value = 'input text'` at that point. Then we need to invoke `fireEvent.change(input)` for the change to happen. After that we can assert on the results by typing `expect(getByTestId('saved')).toHaveTextContent('input text')`

### Dealing with asynchronous code

We have another piece of functionality in our component namely pressing a Load button that invokes a `load()` method, like so:

```js
load = () => {
  var me = this;
  setTimeout(() => {
    me.setState({
      data: [{ title: 'test' }, { title: 'test2' }]
    })
  }, 3000);
}
```

We can see above that the change doesn't happen straight away, this due to us using a setTimeout(). Having a look at our component we can see that we don't render out the data property unless it is set to a value:

```jsx
{this.state.data &&
  <div data-testid="data">
  {this.state.data.map(item => (
    <div className="item" >{item.title}</div>
  ))}
  </div>
}
```

Our test needs to cater to this and wait for the div with attribute `data-testid="data"` to be present before it can assert on it. This can be handled through async/await. We import `waitForElement` from `react-testing-library` which allows us to halt execution while waiting for the element to appear. Let's see what that looks like, by adding a test to our test file:

```js
import {
  render,
  fireEvent,
  wait,
  waitForElement,
} from 'react-testing-library'
import 'react-testing-library/cleanup-after-each';
import React from 'react';
import 'jest-dom/extend-expect'
import Select from '../Note';

describe('Note', () => {
  it('save text', async () => {
    const {getByText, getByTestId, getByPlaceholderText, container, getByLabelText} = render(<Select />);
    const input = getByLabelText('Change text');
    input.value= 'input text';
    fireEvent.change(input);
    fireEvent.click(getByText('Save'));
    console.log('saved', getByTestId('saved').innerHTML);
    expect(getByTestId('saved')).toHaveTextContent('input text')
  })

  it('load data', async() => {
    const {getByText, getByTestId, getByPlaceholderText, container} = render(<Select />);
    fireEvent.click(getByText('Load'));
    const elem = await waitForElement(() => getByTestId('data'))
    const elem = getByTestId('item');
    expect(elem).toHaveTextContent('test');
  })
});
```

Above we see the construct `await waitForElement(() => getByTestId('data'))` that prevent the test from continuing until the element is present. The `waitForElement` returns a promise that doesn't resolve until the element exist on the DOM. Thereafter we assert on the result.

## Summary

We took a look at react-testing-library and wrote tests covering core use-cases. We learned how to deal with events, asynchronous actions, how to manage user input. We covered most things this library has to offer but more importantly, we learned how to think about testing in a different way.

Maybe we don't have to test the internals but rather the surface of our components?

### Further reading

There is a lot more to this library and you are encouraged to look at the
- Official documentation at [Repository](https://github.com/kentcdodds/react-testing-library)
- Blog Post by its creator Kent C Dodd's [Blog post](https://kentcdodds.com/blog/introducing-the-react-testing-library)
