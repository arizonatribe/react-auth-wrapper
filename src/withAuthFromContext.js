import React from 'react'
import withAuth from './withAuth'
import { validateStringOrFunction } from './helpers'

const defaults = {
  authenticatingSelector: contextProps => contextProps.isAuthenticating,
  authenticatedSelector: contextProps => contextProps.isAuthenticated
}

/**
 * A simple wrapper to any component that will only display the component if the user is in an authenticated state.
 * Unlike the `withAuth` higher-order component, this one is expecting a [Context Consumer](https://reactjs.org/docs/context.html#contextconsumer)
 * to be provided, and it will use the props provided to the consumer to apply the authenticated/authenticating selectors.
 * It will look for props injected into the component to determine whether to display either:
 *   - A Failure Component (when the `authenticatedSelector` returns `false`)
 *   - An Authenticating/Pending Component (when `authenticatingSelector` returns `true` and `authenticatedSelector` also returns `false`)
 *   - Your actual Component (when the `authenticatedSelector` returns `true`)
 * If the optional components are not provided `null` will be rendered/returned when in those states.
 *
 * @func
 * @sig {k: v} -> (Component -> ({k: v} -> Component))
 * @param {Function|String} args.authenticatedSelector A prop name OR a selector function
 * that will find the prop injected into the component that identifies whether the user is authenticated or not
 * (defaults to look for a prop named `isAuthenticated`)
 * @param {Function|String} args.authenticatingSelector A prop name OR a selector function
 * that will find the prop injected into the component that identifies whether the user authentication
 * is in-progress or not (defaults to look for a prop named `isAuthenticating`)
 * @param {Function} args.ContextConsumer An instance of a `.Consumer` from the context object that
 * [React.createContext()](https://reactjs.org/docs/context.html#reactcreatecontext) returns
 * @param {Function} args.AuthenticatingComponent An optional component that would be
 * displaying while authentication is in-progress (defaults to an empty Component that returns `null`)
 * @param {Function} args.FailureComponent An optional component that would be diplayed
 * when authentication fails (defaults to a Component Component that returns `null`)
 * @param {String} args.wrapperDisplayName An optional display name to give to
 * the wrapper component (defaults to just 'AuthWrapper')
 * @returns {Function} A function that is ready to receive a Component to decorate
 */
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
