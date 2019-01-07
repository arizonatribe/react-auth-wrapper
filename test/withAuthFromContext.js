import test from 'tape'
import React from 'react'
import { create } from 'react-test-renderer'

import withAuthFromContext from '../src/withAuthFromContext'
import AuthProvider, { AuthContext } from './__mocks__/AuthProvider'
import { accessToken } from './__mocks__/data.json'
import Home, { jsonHome } from './__mocks__/Home'

const AuthenticatedHome = withAuthFromContext({
  authenticatedSelector: 'token',
  ContextConsumer: AuthContext.Consumer
})(Home)

const tree = (
  <AuthProvider>
    <AuthenticatedHome />
  </AuthProvider>
)

test('withAuthFromContext', async assert => {
  const testRenderer = create(tree)
  const testRoot = testRenderer.root
  assert.deepEqual(
    testRenderer.toJSON(),
    null,
    'When no token found by the provider, component does not render'
  )

  testRoot.instance.setState({ token: accessToken })

  testRenderer.update(tree)

  assert.deepEqual(
    testRenderer.toJSON(),
    jsonHome,
    'After setting a token in the provider, the protected component will render'
  )

  assert.end()
})
