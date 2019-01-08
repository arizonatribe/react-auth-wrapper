import test from 'tape'
import React from 'react'
import { create } from 'react-test-renderer'

import withAuthFromContextAndRedirect from '../src/withAuthFromContextAndRedirect'
import AuthProvider, { AuthContext } from './__mocks__/AuthProvider'
import { accessToken } from './__mocks__/data.json'
import Home, { jsonHome } from './__mocks__/Home'

const AuthenticatedHome = withAuthFromContextAndRedirect({
  authenticatedSelector: 'token',
  redirectPath: '/home',
  ContextConsumer: AuthContext.Consumer
})(Home)

test('withAuthFromContextAndRedirect', async assert => {
  const location = (() => {
    let redirectPath = ''
    return {
      pathname: '/home',
      getPath() {
        return redirectPath
      },
      replace(p) {
        redirectPath = p
      }
    }
  })()

  const renderAuth = create(
    <AuthProvider>
      <AuthenticatedHome location={location} redirectPath="/login" />
    </AuthProvider>
  )

  assert.deepEqual(
    renderAuth.toJSON(),
    null,
    'When no token found by the provider, component does not render'
  )

  renderAuth.root.instance.setState({ token: accessToken })

  assert.deepEqual(
    renderAuth.toJSON(),
    jsonHome,
    'After setting a token in the provider, the protected component will render'
  )

  const renderedRedirect = create(
    <AuthProvider>
      <AuthenticatedHome location={location} redirectPath="/login" />
    </AuthProvider>
  )

  assert.deepEqual(
    renderedRedirect.toJSON(),
    null,
    'When un-authenticated, render null (ie, the default FailureComponent)'
  )

  assert.deepEqual(
    location.getPath(),
    '/login?redirect=%2Fhome',
    'When authenticated, render the original Home component'
  )

  assert.end()
})
