import React from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'

const defaults = {
  AuthenticatingComponent: () => null, // dont render anything while authenticating
  FailureComponent: () => null, // dont render anything on failure of the predicate
  wrapperDisplayName: 'AuthWrapper'
}

function withAuth(args = {}) {
  const { AuthenticatingComponent, FailureComponent, wrapperDisplayName } = { ...defaults, ...args }

  // Wraps the component that needs the auth enforcement
  function wrapComponent(DecoratedComponent) {
    const displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'

    const AuthWrapper = ({ isAuthenticated, isAuthenticating, ...restOfProps }) => {
      if (isAuthenticated) {
        return <DecoratedComponent {...restOfProps} />
      } else if (isAuthenticating) {
        return <AuthenticatingComponent {...restOfProps} />
      } else {
        return <FailureComponent {...restOfProps} />
      }
    }

    AuthWrapper.displayName = `${wrapperDisplayName}(${displayName})`

    AuthWrapper.propTypes = {
      isAuthenticated: PropTypes.bool,
      isAuthenticating: PropTypes.bool
    }

    AuthWrapper.defaultProps = {
      isAuthenticating: false
    }

    return hoistStatics(AuthWrapper, DecoratedComponent)
  }

  return wrapComponent
}

export default withAuth
