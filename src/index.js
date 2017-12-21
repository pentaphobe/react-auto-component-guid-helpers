import React from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'
import { Grid, Row as BaseRow, Col as BaseCol } from 'react-styled-flexboxgrid'
import GuidWrapper, {
  ContextGuidWrapper,
  withContextGuid,
  injectGuid
} from './GuidWrapper'

const Row = styled(BaseRow)`
  margin-bottom: 10px;
  padding: 10px;
  background: #ddd;  
  border-radius: 3px;
`

const Col = styled(BaseCol)`  
  padding: 10px; 
  border-right: 1px solid #ccc;
  background: #eee;
  border-radius: 3px;
  
  &:last-of-type {
    border: none;
  }
`

/**
 * Using the withGuid decorator (pairs with ContextGuidWrapper)
 */
const Input = withContextGuid( (props, context) => {  
  return (
    <div>
      <label htmlFor={context.guid}>{props.children}</label>
      <input id={context.guid} />
    </div>
  )
})

/**
 * Example of using guid injection decorator
 */
const SuperBasic = injectGuid( props => (
  <div>
    <pre>{props.guid}</pre>
    <label htmlFor={props.guid}>label</label>
    <input id={props.guid} />
  </div>
))

/** 
 * Contrived example of a changing component
 */
class ComplexTest extends React.Component {
  constructor() {
    super()

    this.state = {
      counter: 0
    }
  }

  componentDidMount() {
    this.handle = setInterval(() => {
      this.setState((state, props) => ({ counter: state.counter + 1 }))
    }, 750)    
  }

  componentWillUnmount() {
    clearInterval(this.handle)
  }

  render() {
    /* we include our timer as a prop to force rerender periodically */
    return (
      <div data-something={this.state.counter}>
        <h3>Instantiated as a child:</h3>
        {this.props.children}
        <h3>Declared in changing render function regenerates GUID each render (not good):</h3>
        <SuperBasic />
      </div>
    )
  }
}

const App = () => (
  <div>
    <Grid fluid>
      <Row>
        <Col xs={12} sm={6}>
          <h1>Magically link elements with unique IDs</h1>
          <p><code>GuidWrapper</code> uses data attributes on descendent elements to assign props</p>
          <GuidWrapper>
            <label data-id-attr='htmlFor'>I am a label</label>
            <input data-id-attr='id' />
          </GuidWrapper>          
        </Col>

        <Col xs={12} sm={6}>
          <h1>Nicer usage with contexts</h1>
          <p><code>ContextGuidWrapper</code> passes Guid to descendents using React context</p>
          <p><em>(<code>withGuid()</code>) can be used to enhance existing components</em></p>
          <ContextGuidWrapper>
            <Input>
              This is our label
            </Input>
          </ContextGuidWrapper>
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={6}>
          <h2>Handy for accessibility too</h2>
          <p>Here we use <code>GuidWrapper</code> to assign matching id and <code>aria-describedby</code> attributes</p>
        </Col>   
        <Col xs={12} sm={6}>
          <GuidWrapper>
            <div role='alert' data-id-attr='aria-describedby'>
              <h1>I am alerting you</h1>
              <div data-id-attr='id'>To dismiss this, click OK</div>
              <button>OK</button>
            </div>
          </GuidWrapper>
          <p><strong>NB:</strong>The basic <code>GuidWrapper</code> manually assigns
          props to all descendents and is thus not ideal</p>        
        </Col>     
      </Row>
      <Row>        
        <Col xs={12} sm={6}>
          <h2>Simple enhancement by prop</h2>
          <p>No need to use <code>GuidWrapper</code> or <code>ContextGuidWrapper</code></p>
          <p>You can just enhance your container component instead with <code>injectGuid()</code></p>
          <SuperBasic />
        </Col> 
        <Col xs={12} sm={6}>
          <h2>...</h2>
          <p>But using <code>injectGuid()</code> isn't suitable for instantiation inside of dynamic render methods</p>
          <ComplexTest>
            <SuperBasic />
          </ComplexTest>
        </Col>       
      </Row>
    </Grid>
    
  </div>
)

render(<App />, document.getElementById('root'))
