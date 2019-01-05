import React from 'react'
import hoistStatics from 'hoist-non-react-statics'
import { validateStringOrFunction } from './helpers'

const defaults = {
  authenticatedSelector: p => Boolean(p.isAuthenticated),
  authenticatingSelector: p => Boolean(p.isAuthenticating),
  AuthenticatingComponent: () => null, // dont render anything while authenticating
  FailureComponent: () => null, // dont render anything on failure of the predicate
  wrapperDisplayName: 'AuthWrapper'
}

/**
 * A simple wrapper to any component that will only display the component if the user is in an authenticated state.
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
 * @param {Function} args.AuthenticatingComponent An optional component that would be
 * displaying while authentication is in-progress (defaults to an empty Component that returns `null`)
 * @param {Function} args.FailureComponent An optional component that would be diplayed
 * when authentication fails (defaults to a Component Component that returns `null`)
 * @param {String} args.wrapperDisplayName An optional display name to give to
 * the wrapper component (defaults to just 'AuthWrapper')
 * @returns {Function} A function that is ready to receive a Component to decorate
 */
function withAuth(args = {}) {
  const {
    FailureComponent,
    wrapperDisplayName,
    authenticatedSelector,
    authenticatingSelector,
    AuthenticatingComponent
  } = { ...defaults, ...args }

  const getAuthenticated = validateStringOrFunction(authenticatedSelector, 'authenticatedSelector')
  const getAuthenticating = validateStringOrFunction(authenticatingSelector, 'authenticatingSelector')

  // Wraps the component that needs the auth enforcement
  function wrapComponent(DecoratedComponent) {
    const displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'

    const AuthWrapper = props => {
      const isAuthenticated = getAuthenticated(props)
      const isAuthenticating = getAuthenticating(props)

      if (isAuthenticated) {
        return <DecoratedComponent {...props} />
      } else if (isAuthenticating) {
        return <AuthenticatingComponent {...props} />
      } else {
        return <FailureComponent {...props} />
      }
    }

    AuthWrapper.displayName = `${wrapperDisplayName}(${displayName})`

    return hoistStatics(AuthWrapper, DecoratedComponent)
  }

  return wrapComponent
}

export default withAuth
