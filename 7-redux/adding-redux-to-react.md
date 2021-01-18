# Adding Redux to React

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

In this article we will cover:

* **Defining** the store
* **Creating**
  * **Presentation components**, these are plain components that you are used to creating
  * **Container components**, by using the `connect()` method on presentational components

## Get started

We need to install a couple of dependencies for this:

```
yarn add redux react-redux
```

Once we have those we are ready to begin

## Adding Redux to React

We need to do the following to make it work:

* create a store
* expose the store with a Provider
* create a container component

### Creating a store

Creating a store is about creating the needed reducers, use a few helper functions and tell Redux about it. Let's have a look at what creating the reducers might look like:

```js
// store.js
import { combineReducers } from 'redux';

const listReducer = (state = [], action) => {
  switch(action.type) {
    case 'CREATE_ITEM':
      return [ ...state, { ...action.payload }];
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload.id);
    default:
      return state;
  }
};

const store = combineReducers({
  list: listReducer
});

export default store;
```

Above we have only defined one reducer, in the same file as `store.js` no less. Normally we would define one reducer per file and have them imported into `store.js`. Now we have everything defined in one file to make it easy to understand, what is going on. One thing worth noting is our usage of the helper function `combineReducers`. This is the equivalent of writing:

```js
const calc = (state, action) => {
  return {
    list: listReducer(state.list, action)
  };
};
```

It's not an exact match but it is pretty much what goes on internally in `combineReducers`.

### Expose the store via a provider

Next step is to wire everything up so we need to go to our `index.js` file and import our store and expose it using a provider. We need to perform the following steps:

* import `createStore` and invoke it to create a store instance
* add the store to a Provider

First thing we do is therefore:

```js
// index.js - excerpt
import { createStore } from 'redux';
import app from './store';

const store = createStore(app);
```

Next step is to wrap our root component `App` in a `Provider` and set its `store` property to our newly created store, like so:

```js
// index.js - excerpt

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

#### Add initial state

We can give our store an initial value, maybe there is some starter data that our app needs. Initial value is added by calling `dispatch` on our store instance like so:

```js
// index.js - excerpt

store.dispatch({ type: 'CREATE_ITEM', payload: { title: 'first item' } });
```

#### Full code

The full code with all the needed imports and calls looks like this:

```js
// index.js

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux'
import app from './store';

const store = createStore(app)
store.dispatch({ type: 'CREATE_ITEM', payload: { title: 'first item' } });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
```

## Accessing and changing data

Now we have a complete setup but we want to be able to access data by talking to the store, same thing goes with if we want to alter data. The way we talk to the store is by introducing the concepts `container component` and `presentation component`.

### Container component

A container component is simply a component that _contains_ the data and in this case has knowledge of Redux. A presentational component relies fully on its inputs wether it is about rendering data or invoking a method. Let's look at a non Redux example that shows this.

First let's define the presentational components:

```js
const PresentationComponent = ({ todos }) => (
  <React.Fragment>
  {todos.map(todo => <div>{todo.title}</div>)
  </React.Fragment>
);

const PresentationComponentInput = ({ add, onChange }) => (
  <div>
    Add a todo
    <input onChange={onChange} />
    <button onClick={add}>Add<button>
  </div>
);
```

As you can see above the components are relying fully on input wether that input is pure data to be rendered or functions to be invoked.

Next up let's define a _container_ component, the component that sits on data and behavior:

```js
class ContainerComponent extends React.Component {
  state = {
    todos: [
      { id: 1, title: 'clean' },
      { id: 2, title: 'dishwash' }
    ],
    newItem: void 0
  }

  change = (ev) => {
    this.setState({
      newItem: ev.target.value,
    })
  }

  add = (todo) => {
    this.setState({
      todos: [ ...this.state.todos, { title: todo }],
      newItem: ''
    });
  }

  render() {
    <React.Fragment>
      <PresentationComponent todos={this.state.todos} />
      <PresentationComponentInput onChange={this.change} add={add} />
    </React.Fragment>
  }
}
```

Above you can see how we have a state and methods that we pass on to the components being rendered:

```js
<React.Fragment>
  <PresentationComponent todos={this.state.todos} />
  <PresentationComponentInput onChange={this.change} add={add} />
</React.Fragment>
```

### Redux

Ok, so we understand the basic idea. Applying this to Redux is about using a method called `connect` that helps us create container components. Let's have a look what that looks like in code:

```js
const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
```

Above we can see how we invoke `connect` and we are able to create a `ListContainer` component. There are three things here we need to explain though, namely:

* `mapStateToProps`, this is function that returns an object of store states our component should have access to
* `mapDispatchToProps`, this is a function that returns an object with methods we should be able to call
* `List`, a presentation component

Let's look at each concept in close detail

#### mapStateToProps

It's job is to decide what data from the store we want to provide to a presentation component. We only want a a slice of state, never the full application state. It for example makes sense for a list component to have access to a `list` state but not a `user` for example.

```js
const mapStateToProps = (state) => {
  return {
    items: state.list
  };
}
```

We can see above that we define a function that takes a `state` as parameter and ends up returning an object. We can see that the returned object has a property `items` that gets its value from `state.list`, this means we are reading the `list` property from the store and it is being exposed as `items`.

#### mapDispatchToProps

This is a function the produces an object, when invoked. Let's have a look at its implementation:

```js
const addItem = (item) => ({ type: 'CREATE_ITEM', payload: { title: item } });

const mapDispatchToProps = dispatch => {
  return {
    onAddItem: item => {
      dispatch(addItem(item))
    }
  };
}
```

Above we see that we take a `dispatch` method in. This method when called will allow us to dispatch actions that leads to the stores state being changed. We define a `onAddItem` method that when invoked will call on `addItem` method. It looks at first glance like we will add an item that is ultimately going to be added to a list in a store.

#### ListContainer - container component

The full code for a container component therefore looks like this:

```js
import React from 'react';
import {connect} from 'react-redux';

import List from '../components/List';

const addItem = (item) => ({ type: 'CREATE_ITEM', payload: { title: item } });

const mapStateToProps = (state) => {
  return {
    items: state.list
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onAddItem: item => {
      dispatch(addItem(item))
    }
  };
}

const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(List);

export default ListContainer;
```

#### List - presentation component

The `List` components source code looks like this:

```js
// components/List.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import CreateItem from './CreateItem';

const Item = styled.div`
  box-shadow: 0 0 5px;
  margin-bottom: 10px;
  padding: 20px;
`;

const ItemsContainer = styled.div`
  margin: 10px;
`;

const Items = ({ items }) => (
  <ItemsContainer>
  {items.map(item => <Item>{item.title}</Item>)}
  </ItemsContainer>
);

const NoItems = () => (
  <div>No items yet</div>
);

const List = ({ items, onAddItem }) => (
  <React.Fragment>
    <CreateItem onAddItem={onAddItem} />
    {items.length === 0 ? <NoItems /> : <Items items={items} />}
  </React.Fragment>
);

List.propTypes = {
  items: PropTypes.array,
};

export default List;
```

Just focusing on the rendering part of this component we see that it renders a list of data but also have the ability to add an item:

```js
const List = ({ items, onAddItem }) => (
  <React.Fragment>
    <CreateItem onAddItem={onAddItem} />
    {items.length === 0 ? <NoItems /> : <Items items={items} />}
  </React.Fragment>
);
```

What's interesting here is we see that it takes `items` and `onAddItem` as `props`. Now this is exactly what the `connect` method does for us when it glues together Redux container data/behaviour with a presentation component. Remember this from our container component:

```js
const ListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
```

The `items` property came from the object returned from `mapStateToProps` and `onAddItem` came from `mapDispatchToProps`.

#### Make it work

What you end up rendering is container components like so:

```js
// App.js

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListContainer from './containers/ListContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ListContainer />
      </div>
    );
  }
}

export default App;
```

Above we see how we render:

```js
<ListContainer />
```

Our container component knows how to grab data from the store but also how to invoke functions that adds/changes store data.

## Summarizing

Your app React/Redux is just more of the same. You will have a number of container components and a number of presentation components and the `connect()` method is how you ensure the presentation component renders data and is able to invoke a method that leads to an action being dispatched and ultimately changes the stores state.

To see a fully working example of what's been described in this chapter please have a look at this repo:

[React Redux](https://github.com/softchris/react-book/tree/master/Redux-Chapter/redux-demo)

