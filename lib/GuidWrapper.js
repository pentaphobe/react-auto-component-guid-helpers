import React from 'react'
import PropTypes from 'prop-types'
import { render } from 'react-dom'
import Guid from 'guid'

/**
 * 
 * Most naïve implementation, recursively scans through descendents searching
 * for the `data-id-attr` attribute, and assigns the guid to the associated prop
 * 
 * eg. if it finds:
 *  `<input data-id-attr='thing' />`
 * 
 * it would produce:
 * 
 *  `<input thing={guid} />`
 * 
 */
const GuidWrapper = (props) => {
  const newId = Guid.raw();

  const updateDescendentProps = children => {
    return React.Children.map(children, child => {
      if (child.type) {
        // child is HTML or React component
        const targetAttr = child.props['data-id-attr'];

        if (targetAttr) {
          child = React.cloneElement(child, {
            [targetAttr]: newId
          })
        }

        updateDescendentProps(child.props.children)
      }

      return child
    })
  }

  const processedChildren = updateDescendentProps(props.children)

  // TODO: use React.Fragment once it's adopted properly
  return (
    <div>
      {processedChildren}
    </div>
  )
}

/**
 * 
 * Uses React contexts to pass guid to descendents
 * 
 * NB: only descendents which have matching `contextTypes` will be influenced
 * this can be achieved manually or by using the `withGuid()` enhancer/decorator
 * 
 */
class ContextGuidWrapper extends React.Component {
  constructor() {
    super()

    this.id = Guid.raw()    
  }

  getChildContext() {
    console.log('getting context')
    return {
      ...this.context,      
      guid: this.id,
      parent: this.context
    }
  }

  render() {    
    return this.props.children;
  }
}

const metaContextTypes = {
  guid: PropTypes.string,
  parent: PropTypes.object  
}

ContextGuidWrapper.childContextTypes = {
  ...metaContextTypes
}

// for inheriting from parent providers
ContextGuidWrapper.contextTypes = {
  ...metaContextTypes  
}

/**
 * 
 * A decorator for components needing to use ContextGuidWrapper
 * 
 */
const withContextGuid = (Component) => {
  Component.contextTypes = {
    ...Component.contextTypes,
    ...metaContextTypes
  }

  return Component
}

/**
 * 
 * Simplest usage - just adds a Guid prop to the passed component
 * 
 */
const injectGuid = (Component) => {  
  return (props) => {
    let guid = Guid.raw()
    return (
      <Component guid={guid} {...props} />
    )
  }
}

export {
  GuidWrapper as default,
  GuidWrapper,
  ContextGuidWrapper,
  withContextGuid,
  injectGuid
}