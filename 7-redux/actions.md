# Actions

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

An Action is a message that we need to pass on to our centralized store. It carries the intention of what we are trying to do as well as data, also called payload. An Action is usually represented as an object

```js
const action = { type: 'CREATE_ITEM', payload: 'my new item' };
```
The `type` is our intention and should be a verb saying what we are trying to achieve. The `payload` carries our data and can be a string or an object or whatever best represents our data.

## Action creator
It is quite common to use something called an action creator. It is simply a function that makes it easier for us to create our action object. It looks something like this:

```js
const createItem = (newName) => ({ type: 'CREATE_ITEM', payload: { title: newName } });
```