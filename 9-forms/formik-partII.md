# Easy forms with Formik - part II

![](https://thepracticaldev.s3.amazonaws.com/i/8e17rqk4bamdm1spw90m.jpg)

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

> This is the continuation of our first part on Formik, the amazing Forms library for React

This article is part of a series:

- [No more tears, handling Forms in React using Formik, part I](https://dev.to/azure/no-more-tears-handling-forms-in-react-using-formik-part-i-20kp)
- No more tears, handling Forms in React using Formik, part II, we are here

In this article we will cover:

- **Schema Validation** with Yup, there is an alternate way to validate your input elements and that is by declaring a schema in Yup and simply assign that to an attribute on the Formik component 
- **Async** validation 
- **Built-in components**, make everything less verbose using some of Formiks built-in components

## Resources
I have made a repo for both these articles, so if you get stuck have a look here [Form demo repo](https://github.com/softchris/formik-example/)

## Built-in components
So far we have been using regular HTML elements like `form` and `input` to build our `form` and we have connected to events like `onSubmit`, `onChange` and `onBlur`. But we can actually be typing a lot less. Say hello to the following components:
- **Form**, this replaces a normal `form` element
- **Field**, this replaces any type of `input` element
- **ErrorMessage**, this doesn't really replace any controls that you have but is a great component that given the attribute `name` is able to show your error message

Let's first look at a simple form and then rewrite it using the above-mentioned components:

```jsx
import { Formik } from 'formik';
import React from 'react';

const FormikExample = () => (
  <Formik
    initialValues={{ name: '' }}
    validation={values => {
      let errors = {};
      if(!values.name) {
        errors.name = 'Name is required';
      }
      return errors;
    }}
    onSubmit={values ={
      console.log('submitted');
    }}
  >
  {({ handleSubmit, handleChange, values, errors }) => (
   <form onSubmit={handleSubmit}>
    <input name="name" onChange={handleChange} value={values.name} />
    {errors.name && 
    <span>{errors.name}</span>
    }
   </form>
  )
  }
  </Formik>
)
```
Ok, above we see what a minimal implementation looks like the classical way of doing it, that is using HTML elements like `form` and `input`. 

Now lets clean this up using Formiks built-in controls:

```jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';


const FormikExample = () => (
  <Formik
    initialValues={{ name: '' }}
    validation={values => {
      let errors = {};
      if(!values.name) {
        errors.name = 'Name is required';
      }
      return errors;
    }}
    onSubmit={values ={
      console.log('submitted');
    }}
  >
  {({ handleSubmit, errors }) => (
   <Form onSubmit={handleSubmit}>
    <Field type="text" name="name" />
    <ErrorMessage name="name"/>
    }
   </Form>
  )
  }
  </Formik>
)
```
Not super impressed? Let's list what we don't need to type anymore:
-  the `onChange` disappears from each `input` element
- the `input` element is replaced by `Field` component
- the `form` element is replaced by `Form` component
- the conditional `{errors.name &&` disappears as well as `ErrorMessage` component takes care of that bit

Not enough? Well imagine you have 10 fields, that is at least 10 lines of code that disappears and it generally it just looks cleaner. Now to our next improvement, we can replace our `validation()` function with a `schema`, up next.

## Schema validation with Yup

Ok, we've covered how we can really clean up our markup by using the builtin controls `Form`, `Field` and `ErrorMessage`. Next step is improving even more by replacing our `validation` property with a `validationSchema` property. For that to be possible we need to define a schema using the library Yup. So what does a schema look like :

```js
import * as Yup from 'yup'

const schema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    lastName: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
  });
``` 

The above schema defines three different fields `firstName`, `lastName` and `email` and gives them each attributes that they should adhere to:
- **firstName**, this should be a string consisting of min 2 characters and maximum 50 characters and its also required
- **lastName**, this is also a string with the same min/max requirements and it's also required
- **email**, this is just a string that is required

As you can see the above is quite readable and by defining your data like this you save yourself from having to type a lot of `if` constructs checking if all attributes are fulfilled. 

Let's now put it to use in our `Formik` element, like so:

```jsx
<Formik validationSchema={schema}>
```

That's it, that is all you need to define your form data in a really expressive way, doesn't that give you a warm and fuzzy feeling? :)

![](https://thepracticaldev.s3.amazonaws.com/i/inn336qns6kslgfg1nun.gif)

## Async validation

Ok, now to our last topic, asynchronous validation. So what's the scenario? Well, sometimes you have data that you can't really tell on client side only whether the entered value is correct or not. Imagine you have a form where you want to find out whether a company or certain web page domain is already taken? At that point, you most likely will need to make a call to an endpoint and the endpoint will not be coming back with the answer instantly. 

Ok, we've set the scene, how do we solve this in Formik? Well, the `validation` property is able to accept a Promise as well. Really, you think? That easy? Well, the solution is in my mind a bit unorthodox, let me show you what I mean:

```jsx
<Formik
  validate={values => {
    console.log('validating async');
    let errors = {};
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        errors.companyName = 'not cool';
        resolve('done');
      },3000);
      }).then(() => {
        if(Object.keys(errors).length) {
          throw errors;
        }
      });
    }}
>
// define the rest here
</Formik>
```
Looking at our `validate` implementation we see that we create a Promise that internally runs a `setTimout` to simulate it going to an endpoint that it takes time to get an answer from. At this point we set a `errors.companyName` to an error text:

```js
setTimeout(() => {
  errors.companyName = 'not cool';
  resolve('done');
},3000);
```
In more real scenario we would probably call a function and depending on the functions answer we would possibly assign `errors.companyName`. I'll show you below what I mean:

```js
isCompanyNameUnique(values.companyName).then(isUnique => {
  if(!isUnique) {
    errors.companyName = `companyName is not unique, please select another one`
  }
  resolve('done')
})
```

Next thing that happens in our code is that we invoke `then()`, that happens when we call `resolve()`. Something really interesting happens in there, we check the `errors` for any properties that might have been set and if so we throw an error with our `errors` object as an argument, like so:

```js
.then(() => {
  if(Object.keys(errors).length) {
    throw errors;
  }
});
```
I don't know about you, but to me, this looks a bit weird. I would have thought providing `validation` with a Promise would have meant that a `reject()` of the Promise would have been a more intuitive way of doing it, like so:

```js
// this to me would have been more intuitive, but observe, this is NOT how it works, so DONT copy this text but refer to the above code instead

validation={ values => 
  console.log('validating async');
  let errors = {};
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      errors.companyName = 'not cool';
      reject(errors);
    },3000);
  })
}}
```

### Async on field level
So far we have shown how to do async validation on Forms level but if you think about would you really want that? Most likely you have a mix of fields where it's enough to validate some of them client side while only a minority if fields need async validation. In such a case it makes sense to apply validation per field. That is quite easy to achieve by typing like this:

```
<Field name="username" validate={this.validate} >
```
This is probably preferred if you got async validation on a field. As for the other fields, you can validate client side it's probably a good idea to define those in on the `Formik` components `validationSchema` and use `Yup` schemas for that as we've described above.

### Words of caution

If we do have async validation in there make sure your validations don't run too often especially if the validation takes time. You don't want a 3-sec validation to trigger every time a key is typed, at most you want it when the user leaves the field to start typing in another field, we refer to this as the `blur` event. So make sure you set up your `Formik` component like this:

```jsx
<Formik
  validateOnBlur={true} 
  validateOnChange={false} >
``` 
This does what you want, setting `validateOnBlur` to `true` is what you want, even though technically this is `true` by default. You want to be explicit with the next one though `validateOnChange`. You want this to be off, or set to `false`. 

## Summary
We've set out to cover built-in components like `Form`, `Field` and `ErrorMessage`, the end result was us cleaning up a lot of code. 

Furthermore, we showed how we could get rid of our validation function by defining a schema using the `Yup` library.

Finally, we covered asynchronous validation and we discussed things to consider like when to validate and that it is probably best to have a field level validation for those few asynchronous fields that we have in a form and to use schema validation for the remaining fields.

That's it, that was the end of our article. I hope this part and the previous one have given you new hope that dealing with Forms in React doesn't have to that painful

![](https://thepracticaldev.s3.amazonaws.com/i/wunzt3wvfpyx1dk1lfz9.gif)