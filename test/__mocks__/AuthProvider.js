import PropTypes from 'prop-types'
import React, { createContext, PureComponent } from 'react'

function trySeveralProps(response) {
  return response.token ||
    response.accessToken ||
    response.access_token ||
    Object.keys(response)
      .filter(k => /token/.test(k))
      .map(k => response[k])
      .find(v => typeof v === 'string' && v)
}

function getTokenWhereverItIs(res) {
  return (res && res.data && trySeveralProps(res.data)) ||
    (res && res.response && trySeveralProps(res.response)) ||
    (res && trySeveralProps(res)) ||
    res
}

export const AuthContext = createContext('auth')

class AuthProvider extends PureComponent {
  state = {
    token: undefined,
    loginUser() {},
    logoutUser() {},
    validateToken() { return false }
  }

  async componentDidMount() {
    const { login, logout, validate, debug } = this.props

    const setToken = (token, error) => {
      if (token) {
        window.localStorage.setItem('token', token)
      } else {
        window.localStorage.removeItem('token')
      }
      this.setState({ error, token })
    }

    const loginUser = async (username, password) => {
      try {
        if (typeof login === 'function') {
          const response = await login(username, password);
          const token = getTokenWhereverItIs(response)
          setToken(token)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        if (debug) console.error(error)
        this.setState({ error, token: undefined })
      }
    }

    const logoutUser = async accessToken => {
      try {
        if (typeof logout === 'function') {
          await logout(accessToken || this.state.token);
        }
        setToken(undefined)
      } catch (error) {
        // eslint-disable-next-line no-console
        if (debug) console.error(error)
        this.setState({ error, token: undefined })
      }
    }

    // eslint-disable-next-line consistent-return
    const validateToken = async accessToken => {
      try {
        if (typeof validate === 'function') {
          const validationResponse = await validate(accessToken)
          const token = getTokenWhereverItIs(validationResponse)
          return token
        } else {
          return accessToken
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        if (debug) console.error(error)
      }
    }

    let initialToken = window.localStorage.getItem('token')

    if (initialToken) {
      initialToken = await validateToken(initialToken)
    }

    this.setState({
      token: initialToken,
      setToken,
      loginUser,
      logoutUser,
      validateToken
    })
  }

  render() {
    const { children } = this.props
    return (
      <AuthContext.Provider value={this.state}>
        {children}
      </AuthContext.Provider>
    )
  }
}

AuthProvider.propTypes = {
  debug: PropTypes.bool,
  login: PropTypes.func,
  logout: PropTypes.func,
  validate: PropTypes.func,
  children: PropTypes.node
}

export default AuthProvider
