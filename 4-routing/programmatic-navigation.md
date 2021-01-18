# Programmatic navigation

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

Usually we navigate using the `Link` component but sometimes we need to navigate based on an action. Then we are talking about programmatic navigation. There are essentially two ways of making that happen:

- history.push('url')
- Redirect component

## Using history

To use the first one we need to inject the `history` inside of our component. This is accomplished by using `withRouter()` function. Below is an example of a component using the described:

```js
import React from 'react';
import { withRouter } from 'react-router-dom';

class TestComponent extends React.Component {
  navigate = () => {
    this.props.history.push('/');
  }

  render() {
    return (
    <React.Fragment>
      <button onClick={this.navigate}>Navigate</button>
    </React.Fragment>
    );
  }
}

export default withRouter(TestComponent);
```

## Using redirect component
Using `Redirect` component is a different approach but just as valid. The idea is to have it look at a state in the component and if that condition is fulfilled then navigate. Here is how it could look like in code:

```js
import { Redirect } from 'react-router';

// this could be from a React context or a Redux store
import { loggedIn } from './login';

const User = () => (
  <div>username ... </div>
);

class UserDetail extends React.Component {
  render() {
    <React.Fragment>
    {isLoggedIn() ? <User /> : <Redirect to='/login' /> }
    </React.Fragment>
  }
}
```