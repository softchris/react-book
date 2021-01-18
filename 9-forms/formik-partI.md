# Easy forms with Formik - part I

![](https://cdn-images-1.medium.com/max/800/1*4J7AdkGvC3Kox5Jhhqo70w.jpeg)

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

> 50% if React developers DON'T use a form library, they build it themselves, that's HUGE number. As people discover Formik I think that number will decrease.

This article is part of series:

- No more tears, handling Forms in React using Formik, part I, **we are here**
- No more tears, handling Forms in React using Formik, part II, _working on it_

In this article we will cover:

- **Forms overview**, discussing Forms in general and different form libraries
- **Set up**, we will cover how to install and set up a React project with Formik so you after the end of this section have a “Hello World” version working
- **Taking it for a spin**, here we will create a relatively realistic Form example that includes most types of form fields
- **Validation types**, there is more than one way to validate like every time the field value change or when you shift focus from one field to the next. Let's look at how to shift between these two modes

This article is part of a series. Formik just has too many interesting topics that would make this article way too long. So in our next part we would cover Schema Validation with Yup, Async validation and work on making everything less verbose using some of Formiks built-in components:

## Resources
I have made a repo for both these articles, so if you get stuck have a look here [Form demo repo](https://github.com/softchris/formik-example/)

## Forms in general and Form libraries

So Forms, your favorite topic ey? No? Yea I agree with you, not my favorite either. It’s a very important topic so many things we need to get right here. Here is a non-exhaustive list:

- **too many** input fields
- **too few** input fields
- **clear** error messages
- **different types** of validation like email, numbers, server-side validation
- **how it validates** like on every character change or when the input field changes or maybe when you press the Submit button

Is this the only reason Forms are painful? Well, it kind of depends on the chosen SPA framework. In our case, we’ve chosen React.js as our SPA Framework. React currently doesn’t have an official Forms library and usually when the creator a Framework doesn’t show the way you end up with a multitude of options like:

- **Roll your own** , this is about building your own way of handling Forms. This is something we’ve covered in this [article](https://itnext.io/keep-calm-and-handle-forms-in-react-js-52c67eea340e)
- [**Formsy**](https://github.com/christianalfoni/formsy-react), according to the creator it aims to be the sweet spot between flexibility and reusability
- **Formik** , that’s the library this article is covering
- [**React Forms**](https://github.com/react-tools/react-form), this is about putting your Form value in a Redux state, if that’s a bad or a good thing is up to you to decide

According to a study I currently conducted on Twitter ( yes I know, not super scientific but still ) 50% of React developers opted for building their own way of handling Forms. That’s a **HUGE** number. My personal opinion here is to go with Formik as it covers most of the features I would expect from a Forms library. Stay with me and maybe you will agree that Formik is indeed a very capable library. :)

Here is an article if you want to know more about how the above-mentioned libraries differ [https://codebrahma.com/form-libraries-in-react/](https://codebrahma.com/form-libraries-in-react/)

## Set up

Like all React projects we start off by using the tool Create React App, CRA. Creating a React app is as simple as typing:

```
npx create-react-app [myapp]
cd [my app]
```

Now that we have a React app lets add the library Formik to it:

```
yarn add formik
OR
npm install formik --save
```

Let’s quickly explain what we need to do to get Formik up and running. We need to do the following:

1. Import the Formik component
2. Define `initialValues`, this will give the form the initial values
3. `validate`, this is a function that takes the form values as input parameters. The point of the function is to construct and return an object representing the state of the form. The object itself is key-value pairs where the key is the name of the form field and the value should be the error message if there is an error detected on that field
4. `onSubmit`, this is a function we need to define where we determine what should happen when we press submit
5. `child`, The child of the Formik component is where we define the markup of the form and it’s containing fields. This is also where we render form errors if there are any

## Taking it for a Spin

Ok then, let’s create a file FirstExample.js, that will we will use to create a component containing Formik. Let’s start off with the import:

```
// FirstExample.js

import { Formik } from 'formik';
```

Now what? Well, we need a component that wraps the Formik component like so:

```jsx
// FirstExample.js

import { Formik } from 'formik';

const FormikExample= () => (
  <Formik>
  // define markup
  </Formik>
)
```

### Handling submit

This will render nothing, but I want to take baby steps to ensure I don’t lose you on the way. Ok, so next order of business is to add a bit more markup and involved the handleSubmit method Formik component exposes so let's change your code to this:

```jsx
// FirstExample.js

import React from 'react';
import { Formik } from 'formik';

const FirstExample = () => (
  <Formik>
  {({ handleSubmit }) => (
   <form onSubmit={handleSubmit}>
     <input name="name" type="text" placeholder="Name"></input
     <button>Submit</button>
   </form>

  )}
  </Formik>
)

export default FirstExample;
```

If you run this in the browser at this point you will get the following error:

![](https://cdn-images-1.medium.com/max/1024/1*zzt06uCqsPHfKdHbxkhzpg.png)

Yes, we need to assign a function to the onSubmit attribute of our Formik component, so let's do that next:

```jsx
// FirstExample.js

import React from 'react';
import { Formik } from 'formik';

const FirstExample = () => (
  <Formik onSubmit={values => {  
    console.log('submitting', values);  
  }} >

  {({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <input name="name" type="text" placeholder="Name"></input>
    <button>Submit</button>
  </form>
  )}
  </Formik>
)

export default FirstExample;
```

Now let's look at the output when we hit the submit button:

![](https://cdn-images-1.medium.com/max/400/1*VM7Gc92-4a5IRWuindkTYw.png)

![](https://cdn-images-1.medium.com/max/360/1*OVjwnByTTBowAZVYssosmg.gif)

It’s ok, really, we will explain WHY this happens next by talking about the life cycle of elements and hopefully bring some clarity.

### Handling the element input lifecycle with initialValues

Empty ey, what are we doing wrong? Ok, we need to tell the Formik component to handle the life cycle of the input elements we have in our form. We do that by defining the initialValues attribute and provide it with an object of what your form contains. We will also need to deal with the onChange event on our input element. Update your code to the following:

```jsx
// FirstExample.js

import React from 'react';
import { Formik } from 'formik';

const FirstExample = () => (
  <Formik 
    initialValues={{ name: '' }}  
    onSubmit={values => {
      console.log('submitting', values);
    }}>
    {({ handleSubmit, handleChange, values }) => (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange}   
             value={values.name}  
             name="name"  
             type="text" 
             placeholder="Name">
      </input>
      <button>Submit</button>
    </form>
    )}
  </Formik>
 )

export default FirstExample;
```

So we did three things above

1. **defined** the initialValues and gave it an object representing our Form input values
2. **connected** the method handleChange to our onChange event on our input element
3. **connected** the value attribute of our input element to our values object and specifically the `name` attribute

Now, lets try pressing submit again and inspect the results:

![](https://cdn-images-1.medium.com/max/530/1*-MjKE3ZQktzELJqDoXe8dA.png)

![](https://cdn-images-1.medium.com/max/260/1*uktHLe9hVylqYh4ijGjhPg.gif)

We see now that Formik picks up our input element and handles the lifecycle properly. Oh yes :)

### Validation

So far we haven’t set up any validation, which is usually what we want do dealing with a Form. So how do we do that in our Formik component? We need to take the following steps:

1. Define the validate property on the Formik component, it expects a function that returns an object with a mapping of our errors
2. read from an errors property in our template function and ensure we show the errors if it’s set

Ok, let's start with the validate property:

```js
validate = {values => {
  let errors = {};
  if(!values.name) {
    errors.name = 'Name is required';
  }
  return errors;
}}
```

Above you see how we provide the validate property with a function that has an input parameter `values`. The values parameter contains our form values and we just need to investigate those to determine whether we have an error or not. As you can see from the above implementation we are inspecting the name element and check whether it is empty. If it is empty we set an error text and lastly we return our errors object.

Next step is ensuring that our markup uses the errors object we just constructed. That’s as easy to do as adding it like so:

```jsx
{({
  handleSubmit,
  handleChange,
  values,
  errors  
}) => (

<form onSubmit={handleSubmit}>
  <div>
    <input name="name" 
           onChange={handleChange} 
           name="name"
           value={values.name} 
           type="text" 
           placeholder="Name">
    </input>

  {errors.name &&  
    <span style={{ color:"red", fontWeight: "bold" }}>  
    {errors.name}      
    </span>  

  } 
</div>
  <div>
    <button>Submit</button>
  </div>
 </form>

)}
```

Looking at this in a browser, it now looks like this:

![](https://cdn-images-1.medium.com/max/1024/1*IkkRtTHrtM3LH2MO7ybnjw.png)

![](https://cdn-images-1.medium.com/max/360/1*RzYxUERbPtbgs-JTXa1BiQ.gif)

## Improving our Form

There are many ways of improving how we work with Forms using Formik, two different ways are:

- **touched**, this state is about indicating whether the user has interacted with this input element or not. If the user has interacted with it touched will have the value true for your element, for example, touched.name will be true
- **hide/disable submit button**, when you submit a form it usually means you talk to a backend and that backend will take some time coming back to you, meanwhile it’s a good idea to ensure the user can’t press the submit button
- **controlling validation invocation**, normally the validation function is run three times that you need to care about, on Blur, on Change, and on Submit.

### Handling touched

So far we have been showing different examples of forms where the validation is run on onChange as well as onBlur and that is the default behavior unless you explicitly shut it off. However, that has the effect of showing errors directly next to a field even though you actually haven’t even started entering characters in that field yet. That is not a great user experience. Let me illustrate the problem with a screenshot:

![](https://cdn-images-1.medium.com/max/1024/1*S9fAVfxvq7gBvT-hBhJ8pw.png)

Above we have entered a character in the name field and erased said character so our validation function is triggered. Not only does the validation trigger when we are still in the field but the validation error is also shown for the address that we haven’t even tried interacting with. None of that is great. So what do we do? Well, we can ensure neither field shows any validation error unless they have been touched. So what does touched mean? It means we have entered characters in the field and we have left it to work on another field. Let’s show how we do that in markup:

```jsx
// FormikTouched.js - excerpt showing the Formik components child function 

{({

  values, 
  errors,
  touched ,
  handleSubmit,
  handleChange,
  handleBlur

}) => (

<form onSubmit={handleSubmit}>

  <h2>Form touched example</h2>

  <div>
    <input onBlur={handleBlur}
           onChange={handleChange}
           placeholder="name" 
           name="name" 
           value={values.name} />

    {errors.name && touched.name &&

    <div>{errors.name}</div>

    }

  </div>
  <button>Submit</button>
</form>

)}
```

We see above that we add access to the touched properties as one of the properties on our input parameter for our child function. We also see that we use said touched value on our first input parameter where we access `touched.name`. Essentially this means that we are able to tell that if touch.name is truthy then it’s OK to show an error. Let’s zoom in on that:

```jsx
<input onBlur={handleBlur}
       onChange{handleChange}
       placeholder="name" 
       name="name" 
       value={values.name} />

{errors.name && touched.name &&

<div>{errors.name}</div>

}
```

As you can see above we need that added logic `&& touched.name` to ensure errors are only shown when the field has actually been interacted with.

### Hide/disable our submit button while submitting

![](https://cdn-images-1.medium.com/max/320/1*d_oIF59sxmBfhnbgo2Tr_g.gif)

We’ve all tried things like the above. Asked the user to be patient, to wait for the service to come back. We’ve even shown a spinner. Sooner or later we’ve come to the conclusion that we must hide or at least disable the submit button while the form is being submitted.

Formik helps us by providing a function called `setSubmitting`. Let’s look at how to use it, we will need to go to our onSubmit definition:

```jsx
onSubmit={(values, { setSubmitting }) => {

  setTimeout(() => {

    alert(JSON.stringify(values, null, 2));

    setSubmitting(false);

}, 400);

}}
```

As you can see above we are using setTimeout to simulate the fact that a backend call takes time and during that time we don’t want any more submits to be possible. Aren’t we missing something like disabling the submit button? Yes, we are. Here is how to do that:

```jsx
<button type="submit" disabled={isSubmitting} >

Submit

</button>
```

When we hit our submit button the property `isSubmitting` is set to true. Once we call setSubmitting(false) inside of our `onSubmit` function `isSubmitting` is set to false.

### Controlling validation invocation

Ok, so we have established there are three invocations points of the validation function that we care about namely

- **on Blur**, this means the validation function will run when we switch focus from one input element to the next
- **on Change**, this means the validation function will run every time we enter/removes a character in the input element
- **on Submit**, additionally, the validation function also runs when we submit our form

Controlling blur behavior is done by changing the value of the attribute `validateOnBlur` to false. Its default value is true, which mean it will run the validation function every time we lose focus on this element. If you know you have a costly validation such as doing _async_ calls in your validation function it’s probably a good idea to run the validation as seldom as possible. Most forms I’ve encountered validates on blur so it’s probably a good idea to keep this functionality enabled unless validation is really really costly or you have a good reason for just running validation upon submitting the form. To control this behavior you would write the following in your markup:

```
<Formik validateOnBlur={false}> // to shut it off
```

As for change events, those are triggered every time you change a character, now usually that’s just way too often in my opinion but you might have valid reasons for using this one. To control its behavior type:

```
<Formik validateOnChange={false}> // to shut it off
```

## Summary

We started talking about Forms, different ways of doing validation, when to validate, how much to put in a form and so on. Continuing we mentioned different Form libraries besides Formik. Thereafter we continued with Formik in particular and looked at how to install and set it up and also step by step build out our Form. Lastly, we looked at different ways of improving our Form.

However, there is much more to this library that’s worth mentioning so we’ve saved certain parts such async validation, Schema validation with Yup and using Formiks built-in components for an even more painless experience with forms.

This was a bit of a lengthy post but there were some GIFs in there so hopefully, you’ve made it all the way to here. In the next post we will learn how to use Formik event better and more efficiently, so stay tuned.