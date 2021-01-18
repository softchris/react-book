# Thinking in components - building a todo app

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

In this chapter we will learn:

* How to break down an app into smaller components
* Introduce the concepts: presentation/dumb component and container component

Thinking in components is about being able to break down an application in components. Consider something as simple as a Todo application. It will most likely consist of a number of components. Let's try and break that down.

## A list of todos

We start off by a list of todos and we realise we need to be able to render said list. Before we consider how we should render it out on the screen, let's think about the underlying data structure.

A todo has a description. Next interesting thing to think about is how do we complete a todo. The intention of having a list of things we need to carry out it as at some point in time we will hopefully carry out those items on the list. Now we have to ask ourselves wether we want to remove a finished item in our todo list or simply mark it as completed. We opt for the latter to feel good about ourselves for completing it but also so what we can see what we have carried out historically. This tells us something about our data structure. It should most likely look something like this:

```js
[
  {
    title: 'clean',
    done: false
  }, {
    title: 'do dishes',
    done: false
  }
]
```

The above list seems like a reasonable design of the data structure and now we can turn to trying to render it in React.

## Rendering the list

Most likely we will try out with something like this:

```js
{todos.map(todo => (
  <div>
    <input type="checkbox" checked={todo.done} /> {todo.title}
  </div>
)}
```

At this point we are able to render our todo list but we are not able to change the value of the todo. Let's build this out to a real React component class and add support for changing a todo to done.

```js
import React, { Component } from 'react';
import styled from 'styled-components';

import './App.css';

const todos = [
  {
    title: 'clean',
    done: false,
  },
  {
    title: 'do the dishes',
    done: true,
  }
];

const Todos = styled.div`
  padding: 30px;
`;

const Todo = styled.div`
  box-shadow: 0 0 5px gray;
  padding: 30px;
  margin-bottom: 10px;
`;

class App extends Component {
  render() {
    return (
      <Todos>
        <h2>Todos</h2>
        {todos.map(todo => (
        <Todo>
          <input type="checkbox" checked={todo.done} /> {todo.title}
        </Todo>
        ))}
      </Todos>
    );
  }
}

export default App;
```

Above we have created a fully working component but we are yet to add support for changing our `todos`. Let's do that next. We need to do the following:

* listen to an `onChange` event when we check our checkbox
* change the item in our todo list to reflect the change we just made

Listen to onChange is quite simple, we just need to add a method that listens to it like so:

```
<input type="checkbox" checked={todo.done} onChange={() => this.handleChange(todo)} />
```

After that we need to figure out a way to change a todo in our list. We could be altering the todos list directly but the more React thing todo would be to create a todos state in the component, like so:

```
state = {
  todos
}
```

Let's now add the final code:

```js
import React, { Component } from 'react';
import styled from 'styled-components';

import './App.css';

const todos = [
  {
    title: 'clean',
    done: false,
    id: 1,
  },
  {
    title: 'do the dishes',
    done: true,
    id: 2,
  }
];

const Todos = styled.div`
  padding: 30px;
`;

const Todo = styled.div`
  box-shadow: 0 0 5px gray;
  padding: 30px;
  margin-bottom: 10px;
`;

class App extends Component {
  state = {
    todos,
  };

  handleChecked = (todo) => {
    const newTodos = this.state.todos.map(t => {
      if (t.id === todo.id) {
        return { ...t, done: !t.done };
      }
      return t;
    });

    this.setState({
      todos: newTodos,
    });
  }

render() {
  return (
    <Todos>
      <h2>Todos</h2>
      {this.state.todos.map(todo => (
        <Todo key={todo.id}>
        <input type="checkbox" onChange={() => this.handleChecked(todo)} checked={todo.done} />
      {todo.title}
      </Todo>
      ))}
    </Todos>
  );
}
}

export default App;
```

Let's zoom in on the `handleChecked()` method here to realise what we have done:

```js
handleChecked = (todo) => {
  const newTodos = this.state.todos.map(t => {
    if (t.id === todo.id) {
    return { ...t, done: !t.done };
    }
    return t;
  });

  this.setState({
    todos: newTodos,
  });
}
```

we go through the list, todo by todo until we find the selected `todo` then we change it state by doing an object spread:

```js
return { ...t, done: !t.done }
```

Another thing worth noting is that our todo now consist of three properties:

* title
* done
* id

We needed the `id` property to identify which todo we were trying to modify.

## Create a todos component

So far we have everything inside of the App component and we don't want our entire application to live in there. What if we want to add other stuff. First thing we are going to do is to create a `Todos` component and thereby move the rendering, state and methods into that component. We will end up with the following files:

* App.js - we had this from the beginning
* Todos.js - this is new

Our Todos.js will contain pretty much all of what App.js used to contain:

```js
// Todos.js

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TodosContainer = styled.div`
  padding: 30px;
`;

const Todo = styled.div`
  box-shadow: 0 0 5px gray;
  padding: 30px;
  margin-bottom: 10px;
`;

class Todos extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
  }

  state = {
    todos: this.props.todos,
  };

  handleChecked = (todo) => {
    const newTodos = this.state.todos.map(t => {
      if (t.id === todo.id) {
        return { ...t, done: !t.done };
      }
      return t;
    });

    this.setState({
      todos: newTodos,
    });
}

  render() {
    return (
    <TodosContainer>
      <h2>Todos</h2>
      {this.state.todos.map(todo => (
        <Todo key={todo.id}>
          <input type="checkbox" onChange={() => this.handleChecked(todo)} checked={todo.done} /> {todo.title}
        </Todo>
      ))}
    </TodosContainer>
    );
  }
}

export default Todos;
```

The App.js will now look like the following:

```js
import React, { Component } from 'react';

import Todos from './Todos';

import './App.css';

const todos = [
  {
    title: 'clean',
    done: false,
    id: 1,
  },
  {
    title: 'do the dishes',
    done: true,
    id: 2,
  }
];

class App extends Component {
  render() {
    return (
    <Todos todos={todos} />
    );
  }
}

export default App;
```

## Breaking down the todos component

So far Todos.js is one massive component. We can break it down according to responsibility. I mean it works to have it like it is but it's usually better to break down your app into small focused components, to make maintenance easier. Another reason is making it easier to use certain components in other places. So what can we break down Todos.js into? Well we can at least break it down into:

* Todos, this would render a list of Todo components and handle all the events
* Todo, this would only be responsible for rendering a Todo and send any change action upwards

Let's make the necessary changes:

```js
// Todo.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TodoContainer = styled.div`
  box-shadow: 0 0 5px gray;
  padding: 30px;
  margin-bottom: 10px;
`;

const Todo = ({ todo, handleChecked }) => (
  <TodoContainer key={todo.id}>
    <input type="checkbox" onChange={() => handleChecked(todo)} checked={todo.done} />
    {todo.title}
  </TodoContainer>
);

Todo.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string,
    done: PropTypes.bool,
    id: PropTypes.number,
  }),
  handleChecked: PropTypes.func,
};

export default Todo;
```

Above we have broken out the `Todo` rendering into its own component. As you can see the component is not defined as a class inheriting from React.Component but is simply just a function. This is called a presentation or dumb component. What makes it dumb is that it knows nothing about the context it is in only that it relies on input, `todo` and invokes any action that it is being provided through its props, namely `handleChecked()`. Our Todos file now looks a bit simpler like so:

```js
// Todos.js

import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Todo from './Todo';

const TodosContainer = styled.div`
  padding: 30px;
`;

class Todos extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
  }

  state = {
    todos: this.props.todos,
  };

  handleChecked = (todo) => {
    const newTodos = this.state.todos.map(t => {
    if (t.id === todo.id) {
      return { ...t, done: !t.done };
    }
    return t;
  });

  this.setState({
    todos: newTodos,
  });
}

  render() {
    return (
      <TodosContainer>
        <h2>Todos</h2>
        {this.state.todos.map(todo => (
        <Todo todo={todo} key={todo.id} handleChecked={this.handleChecked} />
        ))}
      </TodosContainer>
    );
  }
}

export default Todos;
```

We now import the Todo component, like so:

```js
import Todo from './Todo';
```

Let's zoom in on the interesting part:

```js
<Todo todo={todo} key={todo.id} handleChecked={this.handleChecked} />
```

Above we simply let the Todo component handle all the rendering and we provide it with the data `todo` and the method `handleChecked()`. Ok so we mentioned presentational components so far so what is the other kind of component the container component. A container component is a component where data and logic lives. It 'contains' the meat of the application. In our app the Todos component is a container component and the Todo is a presentational component. If you are building your app in the right way you will end up with a majority of presentational components and a few container components.

## Summary

We set out to create a working Todo app. We did so. We also set out to break down the mentioned app into many small components where each component was more focused on its task making future changes or reuse a lot easier. We introduced the term Dumb/Presentation component and Container component and explained what those were. to show that it only relied on inputs.