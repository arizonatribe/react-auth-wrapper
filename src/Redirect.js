import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { validateStringOrFunction, validateBoolOrFunction, getFullRedirectPath } from './helpers'

class Redirect extends PureComponent {
  componentDidMount() {
    const { redirectPath, location, history } = this.props

    if (redirectPath) {
      if (history && typeof history.push === 'function') {
        history.push(redirectPath)
      } else if (location && typeof location.replace === 'function') {
        location.replace(redirectPath)
      } else {
        // eslint-disable-next-line no-undef
        window.location.replace(redirectPath)
      }
    }
  }

  render() {
    return null
  }
}

Redirect.propTypes = {
  redirectPath: PropTypes.string,
  location: PropTypes.shape({
    replace: PropTypes.func
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  })
}

const defaults = {
  authenticatedSelector: p => Boolean(p.isAuthenticated),
  authenticatingSelector: p => Boolean(p.isAuthenticating),
  allowRedirectBack: true,
  FailureComponent: Redirect,
  redirectQueryParamName: 'redirect'
}

function createRedirectWrapper(wrapper) {
  function withRedirect(args = {}) {
    const allArgs = { ...defaults, ...args }
    const {
      redirectPath,
      FailureComponent,
      allowRedirectBack,
      authenticatedSelector,
      authenticatingSelector,
      redirectQueryParamName
    } = allArgs

    const redirectPathSelector = validateBoolOrFunction(redirectPath, 'redirectPath')
    const allowRedirectBackFn = validateBoolOrFunction(allowRedirectBack, 'allowRedirectBack')
    const getAuthenticated = validateStringOrFunction(authenticatedSelector, 'authenticatedSelector')
    const getAuthenticating = validateStringOrFunction(authenticatingSelector, 'authenticatingSelector')

    const EnhancedFailureComponent = props =>
      <FailureComponent
        {...props}
        redirectPath={getFullRedirectPath(
          redirectQueryParamName,
          redirectPathSelector(props),
          allowRedirectBackFn(props),
          props.location
        )}
      />

    return DecoratedComponent => {
      const AuthWrapped = wrapper({
        ...allArgs,
        FailureComponent: EnhancedFailureComponent
      })(DecoratedComponent)

      return props =>
        <AuthWrapped
          {...props}
          isAuthenticated={getAuthenticated(props)}
          isAuthenticating={getAuthenticating(props)}
        />
    }
  }

  return withRedirect
}

export default createRedirectWrapper
