# JSX

> 在 [Twitter](https://twitter.com/chris_noring) 上关注我，很高兴接受您对主题或改进的建议  /克里斯

本章涵盖以下主题:

- **什么是JSX**： JSX 是你在 React 中一直使用的东西，后面让我们解释一下它是什么。
- **为什么使用它**： 你可以选择不使用JSX，但几乎没有人这样做，它确实让你的编程更简单。

## 是什么和为什么

JSX 就是很像你在 JavaScript 中写 XML. 这是一个预处理器步骤. 你不必拥有它，但它让编程变得轻松多了。

### 简单示例

这是一行代码的一个简单示例:

```javascript
const Elem = <h1>Some title</h1>;

// and you can use it in React like so:
<div>
  <Elem />
</div>;
```

Elem的上述声明在 JavaScript 中看起来很像 XML。 怎么回事? 当它被处理时，它变成以下ES5代码:

```javascript
React.createElement("Elem", null, "Some title");
```

所以调用createElement，这些参数是这样的:

- **第一个参数，参数名称**：`Elem` 成为元素名称。
- **第二参数, 属性**：上面的第二个参数为 null，表示我们传入任何元素属性，因为我们没有给 `Elem` 传入任何属性。
- **第三个参数，元素值**：第三个也是最后一个参数是元素值。(h1 标签里的内容）

#### 使用属性（或参数）的示例

让我们看下面的一个示例，我们给 `Elem` 传入一个属性 `title`:

```javascript
const Elem = <h1>Some title</h1>;

// usage:
<div>
  <Elem title="a title">
</div>
```

以上将被编译成下面这样的代码:
```javascript
React.createElement(
  "Elem",
  {
    title: "a title",
  },
  "Some title"
);
```

上面我们可以看到我们的属性 `title` 现在是第二个参数的一部分。

### 多行

大多数时候，你的组件用一行代码放不下，要另起多行时，它有时候不会发挥作用。

解决方案是将多个元素包装在一个括号 `()` 中，如下所示:

```jsx
const Elem = (
  <div>
    <h1>Some title</h1>
    <div>Some content</div>
  </div>
);
```

### 父类组件

JSX 组件需要有一个父级。以下内容不正确:

```html
<!-- would be incorrect, no parent element -->
const Elem = (
  <h1>Some title</h1>
  <div>Some content</div>
)
```

您可以通过以下方式解决此问题:

- **将它包裹在一个元素中**，您可以像这样将内容包装在div元素中:

```html
const Elem = (
<div>
  <h1>Some title</h1>
  <div>Some content</div>
</div>
)
```

- **或者把它包裹在 `React.Fragment`** 组件中, 像下面这样:

```html
const Elem = (
<React.Fragment>
  <h1>Some title</h1>
  <div>Some content</div>
</React.Fragment>
)
```

我们更经常使用 `React.Fragment` 来代替 div。

## 总结

这几乎是我们在 JSX 知识上需要了解的全部内容，以便能够使用它:

- 它很像 XML，它的内部原理是使用 `React.createElement()` 来生成代码。
- 多行需要括号才能工作。
- 你需要有一个父元素，`React.Fragment` 是很好的选择。
