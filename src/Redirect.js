import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { parse, validateStringOrFunction, validateBoolOrFunction, getFullRedirectPath } from './helpers'

class Redirect extends PureComponent {
  render() {
    const { redirectPath, location, history } = this.props
    if (redirectPath) {
      if (history && typeof history.push === 'function') {
        history.push(redirectPath)
      } else if (location && typeof location.replace === 'function') {
        location.replace(redirectPath)
      } else if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-undef
        window.location.replace(redirectPath)
      }
    }
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
  wrapperDisplayName: 'AuthRedirectWrapper',
  redirectQueryParamName: 'redirect'
}

function getLocation(props = {}) {
  return props.location || (typeof window !== 'undefined' && window.location) || {}
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
      redirectQueryParamName = 'redirect'
    } = allArgs

    const allowRedirectBackFn = validateBoolOrFunction(allowRedirectBack, 'allowRedirectBack')
    const getAuthenticated = validateStringOrFunction(authenticatedSelector, 'authenticatedSelector')
    const getAuthenticating = validateStringOrFunction(authenticatingSelector, 'authenticatingSelector')

    const EnhancedFailureComponent = props =>
      <FailureComponent
        {...props}
        redirectPath={
          parse(
            getLocation(props).search,
            redirectQueryParamName
          ) ||
          getFullRedirectPath(
            redirectQueryParamName,
            props.redirectPath || redirectPath,
            allowRedirectBackFn(props),
            getLocation(props)
          )
        }
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
