# Pithy.js

An internal DSL for generating HTML in JavaScript.


## Examples

#### Basic elements

```javascript
html.div('#main', [
    html.h1(null, 'Hello, world!'),
    html.img({src: 'foo.jpg'})
]);
```

```html
<div id="main">
    <h1>Hello, world!</h1>
    <img src="foo.jpg"/>
</div>
```

#### Loops etc.

Using [Underscore.js](http://underscorejs.org) or similar:

```javascript
function todoItem(item) {
    return html.li({rel: item.id}, [
        html.div('.title', item.title),
        html.button('.destroy', 'delete')
    ]);
}

function todoList(list) {
    return html.ul('.todo-list', _.map(list, todoItem));
}

todoList([
    {id: 1, title: 'item one'},
    {id: 2, title: 'item two'},
    {id: 3, title: 'item three'}
]);
```

```html
<ul class="todo-list">
    <li rel="1">
        <div class="title">item one</div>
        <button class="destroy">delete</button>
    </li>
    <li rel="2">
        <div class="title">item two</div>
        <button class="destroy">delete</button>
    </li>
    <li rel="3">
        <div class="title">item three</div>
        <button class="destroy">delete</button>
    </li>
</div>
```


## Why use an internal DSL?

- It's a more convenient and safer alternative to string contatenation
- Very flexible, you can use all the power of JavaScript functions and
  control structures
- For small bits of HTML you might not want to switch contexts form code
  to a template
- Easier to debug than a templating engine
- You get full tool-chain support:
    - editor support: syntax highlighting, code tools etc etc
    - code analyzers: jslint, jshint
    - testing/coverage tools

## When to use?

- Consider using where you might currently use string concatenation
- Avoid using for large HTML documents or in places where speed is critical
- Good for small snippets used for client-side page updates
- Bad for generating huge amounts of HTML on the server


## Usage

I like to alias the 'pithy' library as 'html':

```javascript
var html = require('pithy');
```

You can then just use html.`tagname` as a function to create the
appropriate element. Please note, you actually get a html.SafeString
object back, not a native JavaScript String. This *might* mess up your
isString() tests. If you have a workaround please send a pull-request.

There is also a html.escape() function for escaping HTML (returns a
html.SafeString). It will not escape a value that is already a
html.SafeString object.
