import React from 'react'
import withAuth from './withAuth'
import { validateStringOrFunction } from './helpers'

const defaults = {
  authenticatingSelector: contextProps => contextProps.isAuthenticating,
  authenticatedSelector: contextProps => contextProps.isAuthenticated
}

function withAuthFromContext(args = {}) {
  const { ContextConsumer, authenticatedSelector, authenticatingSelector, ...restOfArgs } = {
    ...defaults,
    ...args
  }

  const getAuthenticated = validateStringOrFunction(authenticatedSelector, 'authenticatedSelector')
  const getAuthenticating = validateStringOrFunction(authenticatingSelector, 'authenticatingSelector')

  return DecoratedComponent => {
    const AuthWrappedComponent = withAuth(restOfArgs)(DecoratedComponent)

    return props =>
      <ContextConsumer {...props}>
        {contextProps =>
          <AuthWrappedComponent
            {...props}
            isAuthenticated={getAuthenticated(contextProps)}
            isAuthenticating={getAuthenticating(contextProps)}
          />
        }
      </ContextConsumer>
  }
}

export default withAuthFromContext
