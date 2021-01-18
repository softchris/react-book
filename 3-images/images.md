# Adding images

Follow me on [Twitter](https://twitter.com/chris_noring), happy to take your suggestions on topics or improvements /Chris

So how do we deal with images that we have locally. It's really very easy, we just need to import and assign them to the source property of our image, like so:

```
import myImage from './assets/myImg.png';

class TestComponent extends React.Component {
  render() {
    return (
      <img src={myImage} />
    );
  }
}
```

So why does this work, well here is an explanation from the official docs:

>...You can import a file right in a JavaScript module. This tells Webpack to include that file in the bundle. Unlike CSS imports, importing a file gives you a string value. This value is the final path you can reference in your code, e.g. as the src attribute of an image or the href of a link to a PDF.

> To reduce the number of requests to the server, importing images that are less than 10,000 bytes returns a data URI instead of a path. This applies to the following file extensions: bmp, gif, jpg, jpeg, and png...