# Automatic ID generator for React apps

Provides a number of ways to inject GUIDs into your React app/components


## Usage

### Basic property injection

This is simple to use, and works with generic JSX as well as components, 
however it's the least efficient approach since it has to scan through all
descendent components to manually apply properties

```js
import GuidWrapper from 'react-guid-wrapper'

const App = () => (
  <GuidWrapper>
    <label data-id-attr='htmlFor'>I am a label</label>
    <input data-id-attr='id' />
  </GuidWrapper>
)
```

result:
```html
<label for="470826c5-f67f-c55a-ca05-c1a488cb1db4">I am a label</label>
<input id="470826c5-f67f-c55a-ca05-c1a488cb1db4" />
```



### Using React contexts (nicer approach)

React allows use of [contexts](https://reactjs.org/docs/context.html) to pass data to descendent components more 
elegantly and with no data duplication, we provide a decorator function and
a wrapping component to expose this option


```js
import {
  ContextGuidWrapper,
  withContextGuid,
} from 'react-guid-wrapper'

// The `withContextGuid()` decorator adds context support to your component
// and provides a `context` prop 
const Input = withContextGuid( (props, context) => {  
  return (
    <div>
      <label htmlFor={context.guid}>{props.children}</label>
      <input id={context.guid} />
    </div>
  )
})

// All components which need access to a single GUID
// must be wrapped in a <ContextGuidWrapper> 
// (this handles the generation and assignment of GUID)
const App = () => (
  <ContextGuidWrapper>
    <Input>
      This is our label
    </Input>
  </ContextGuidWrapper>
)
```

result:
```html
<div>
  <label for="8715f4fe-744a-5d89-0c15-394e16a19847">This is our label</label>
  <input id="8715f4fe-744a-5d89-0c15-394e16a19847">
</div>
```


### Property injection

```js
import {
  injectGuid
} from 'react-guid-wrapper'


// the `injectGuid()` decorator simply adds a `guid` property to your
// component
const Input = injectGuid( props => (
  <div>
    <label htmlFor={props.guid}>{props.children}</label>
    <input id={props.guid} />
  </div>
))


const App = () => (
  <Input>lorem ipsum</Input>
)
```

```html
<div>
  <label for="470826c5-f67f-c55a-ca05-c1a488cb1db4">lorem ipsum</label>
  <input id="470826c5-f67f-c55a-ca05-c1a488cb1db4">
</div>
```

