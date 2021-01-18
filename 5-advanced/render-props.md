# Learn Render props pattern

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

> What is the Render props pattern? The Render props pattern is a way for us to create a component that provides some kind of data to a child component.

Why would we want that? Well imagine that we wanted to do something of the following:

- **fetching data**, wouldn’t it be nice to have a component that abstracts away all of the mess of HTTP and just serves you the data when it’s done?
- **A/B testing**, as you launch an app into production you will eventually want to improve but you might not know the best way forward or you might want to release often and push the code to production but some feature is not yet ready to see the light of day, so you want to be able to conditionally decide whether something is visible or not.


![alt text](https://thepracticaldev.s3.amazonaws.com/i/7suasq4cy902pekbtzcx.jpg "Render props, the pattern that is on fire")

If you have any of the scenarios above you have reusable functionality. With reusable functionality, you most likely want to abstract that away into a function or a component, we’re gonna opt for the latter.

Wouldn’t it be nice if we can create components for this functionality and just serve it up to some component? That child component would be unaware that it is being served up data.

In a sense, this resembles what we do with Providers but also how container components wrap presentation components. This all sounds a bit vague so let’s show some markup how this could look:

```jsx
const ProductDetail = ({ product }) => ( 
  <React.Fragment> 
    <h2>{product.title}</h2> 
    <div>{product.description}</div> 
  </React.Fragment> ) 
  
<Fetch url="some url where my data is" 
  render={(data) => <ProductDetail product={data.product} /> }
/>
```

As we can see above we have two different components `ProductDetail` and `Fetch`. `ProductDetail` just looks like a presentation component. `Fetch` on the other hand looks a bit different. It has a property url on it and it seems like it has a render property that ends up rendering our `ProductDetail`.

## Render props explained
We can reverse engineer this and figure out how this works.

Let’s have a look at the code again:

```jsx
<Fetch url="some url where my data is" 
  render={(data) => <ProductDetail product={data.product} /> }
/>
```

Our Fetch component has an attribute `render` that seems to take a function that ends up producing JSX. Here is the thing, the whole render-props pattern is about us invoking a function in our return method. Let me explain that by showing some code:

```js
class Fetch extends React.Component { 
  render() { 
    return this.props.render(); 
  } 
}
```

This is what the pattern is, at its simplest. The way we use the `Fetch` component means we at least need to send something into the `this.props.render()` call. Let's just extract the function invocation bit above and look at it:

```jsx
(data) => <ProductDetail product={data.product} />
```

We can see above that that we need a parameter data and data seems to be an object. Ok, so where does data come from? Well thats the thing with our `Fetch` component, it does some heavy lifting for us namely carrying out HTTP calls.

## Creating a component for HTTP
Let’s add some life cycle methods to `Fetch` so it looks like this:

```js
class Fetch extends React.Component { 
  state = { 
    data: void 0, 
    error: void 0 
  } 

  componentDidMount() { 
    this.fetchData(); 
  } 

  async fetchData() { 
    try { 
      const response = await fetch(this.props.url); 
      const json = await response.json(); 
      this.setState({ data: json }); 
    catch (err) { 
      this.setState({ error: err }) 
    } 
  } 

  render() { 
    if (!this.state.data) return null; 
    else return this.props.render(this.state.data); 
  } 
}
```

> Quick note, if you are unfamiliar with `void 0`, that’s just setting something to `undefined`

Ok, now we have fleshed out our component a little. We’ve added the method `fetchData()` that makes HTTP call,s given `this.props.url` and we can see that our `render()` method renders null if `this.state.data` isn't set, but if the HTTP call finished we invoke `this.props.render(data)` with our JSON response.

However, it lacks three things:

- **handling error**, we should add logic to handle error
- **handling loading**, right now we render nothing if thefetch() call hasn't finished, that isn't very nice
- **handling this.props.url**, this prop might not be set initially and it might be changed over time, so we should handle that

### Handling errors
We can easily handle this one by changing our `render()` method a little, to cater to if `this.state.error` is set, after all we have already written logic that sets `this.state.error` in our catch clause in the `fetchData()` method.

Here goes:

```js
class Fetch extends React.Component { 
  state = { 
    data: void 0, 
    error: void 0 
  } 

  componentDidMount() { 
    this.fetchData(); 
  } 

  async fetchData() { 
    try { 
      const response = await fetch(this.props.url); 
      const json = await response.json(); 
      this.setState({ data: json }); 
    catch (err) { 
      this.setState({ error: err }) 
    } 
  } 

  render() { 
    const { error, data, loading } = this.state; 
    if(error) return this.props.error(error); 
    if (data) return this.props.render(data); 
    else return null; 
  } 
}
```

Above we added handling of this.state.error by invoking `this.props.error()`, so that is a thing we need to reflect once we try to use the `Fetch` component.

### Handling loading
for this one we just need to add a new state loading and updated the `render()` method to look at the said property, like so:

```js
class Fetch extends React.Component { 
  state = { 
    data: void 0, 
    error: void 0,
    loading: false 
  } 

  componentDidMount() { 
    this.fetchData(); 
  } 

  async fetchData() { 
    try { 
      this.setState({ loading: true }); 
      const response = await fetch(this.props.url); 
      const json = await response.json(); 
      this.setState({ data: json }); 
      this.setState({ loading: false }); 
    catch (err) { 
      this.setState({ error: err }) 
    } 
  }
 
  render() { 
    const { error, data, loading } = this.state; 
    if(loading) return <div>Loading...</div> 
    if(error) return this.props.error(error); 
    if (data) return this.props.render(data);
    else return null; 
  } 
}
```

Now, above we are a bit sloppy handling the loading, yes we add an `if` for it but what we render can most likely be improved using a nice component that looks like a spinner or a ghost image, so that's worth thinking about.

## Handling changes to this.props.url
It’s entirely possible that this URL can change and we need to cater to it unless we plan on using the component like so

> `<Fetch url="static-url">`

in which case you should skip this section and look at the next section instead ;)

The React API recently changed, before the change we would’ve needed to add the life cycle method `componentWillReceiveProps()` to look at if a prop changed, it's considered unsafe, however, so we must instead use

```js
componentDidUpdate(prevProps) { 
  if (this.props.url && this.props.url !== prevProps.url){
    this.fetchData(this.props.url); 
  } 
}
```

That’s it, that’s what we need, let’s show the full code for this component:

```js
class Fetch extends React.Component { 
  state = { 
    data: void 0, 
    error: void 0,
    loading: false 
  } 
  componentDidMount() { 
    this.fetchData(); 
  } 
  componentDidUpdate(prevProps) { 
    if (this.props.url && this.props.url !== prevProps.url) {     
      this.fetchData(this.props.url); 
    } 
  } 
  async fetchData() { 
    try { 
      this.setState({ loading: true }); 
      const response = await fetch(this.props.url); 
      const json = await response.json(); 
      this.setState({ data: json }); 
      this.setState({ loading: false }); 
    catch (err) { 
      this.setState({ error: err }) 
    } 
  } 
  render() {
    const { error, data, loading } = this.state; 
    if(loading) return <div>Loading...</div>
    if(error) return this.props.error(error);
    if(data) return this.props.render(data); 
    else return null; 
  } 
}
```

To use our component we can now type:

```jsx
<Fetch 
  url={url-to-product} 
  render={(data) => <ProductDetail product={data.product} />} 
  error={(error) => <div>{error.message}</div>} 
/>
```

## A/B Testing
Let’s move on to our next case. We will sooner or later have probably two major reasons for wanting to show code conditionally using this component:

- **it’s not ready yet**, we want to deploy often and we may want to show a new feature only to our Product Owner so we can gather feedback, so if we would be able to control the showing of these components content with a flag, that would be great
- **A/B test**, let’s say we don’t know which new Checkout page we want to go to, within our e-commerce app, then it would be great if we can send half the users to version1 and the other half to version 2. In such a scenario you might have two different pages but if the difference is minor, like the toggling of a few sections, then this could be a good candidate.

Ok, let’s look at how we would be using this component:

```jsx
<FeatureFlag 
  flag={showAlternateSection} 
  render={()=> <div>Alternate design</div>} 
  else={()=> <div>Normal design</div>} 
/>
```

Above we have a component `FeatureFlag` and the following attributes, let's break down how we mean to use them:

- **flag**, this would be the name of the feature flag, most likely a string
- **render**, this would be a method we invoke given that the feature flag is enabled
- **else**, this would be a method we invoke if feature flag is disabled or non-existent

## Building our component
Ok, we know how we intend to use our component, let’s try to build it:

```js
class FeatureFlag extends React.Component { 
  state = { 
    enabled: void 0 
  } 
  
  componentDidMount() { 
    const enabled = localStorage.getItem(this.props.flag) === 'true'; 
    this.setState({ enabled }); 
  } 
  render() { 
    if(enabled) return this.props.render(); 
    else if(enabled === false) return this.props.else(); 
    else return null; 
  } 
}
```

Ok, so introduce three states here:

- **true**, when we know the flag is true
- **false**, when we know the flag is false
- **void 0/undefined**, when the flags value hasn’t been resolved yet

Why do we need three states? Well, we want to make sure it renders exactly what it should be rendering and that it doesn’t show something it shouldn’t, if only for a millisecond.

Ok, that sounds a bit nuts, `localStorage.getItem()` is usually fast to respond.

Yea sure, ok, I might be a wee bit crazy, but what if the flag value isn’t in `localStorage` but it resides on a service that we need to call, then it might take some time to get the value back...

So imagine our `componentDidMount()` looks like this instead:

```js
async componentDidMount() { 
  const enabled = await flagService.get(this.props.flag);
  this.setState({ enabled }); 
}
```

That’s a minor change if you want to place your flags in a service instead of `localStorage`:

## Summary
Render props pattern is all about rendering a function that itself renders JSX and as you can see you can create quite powerful and useful components based on this design pattern.

Hope you found this article useful, if you did, please give me some claps.

Oh, I would love it if you left me some links in the comments to Components you built using the Render props pattern.

Stay safe, remember it’s never your fault, it’s the compiler ;)

### Further reading
- [Render props](https://reactjs.org/docs/render-props.html) pattern
- My [free book](https://legacy.gitbook.com/book/chrisnoring/react/details) on React
- [My twitter](https://twitter.com/chris_noring)

Let’ give credit where credit is due. I wouldn’t be writing this article if it wasn’t for https://twitter.com/l0uy so give him a follow :)

