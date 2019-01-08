import tape from 'tape'
import React from 'react'
import { createRenderer } from 'react-test-renderer/shallow'
import addAsertions from 'extend-tape'
import jsxExtensions from 'tape-react-extensions'

import withAuth from '../src/withAuth'
import { accessToken } from './__mocks__/data'
import Home from './__mocks__/Home'

const test = addAsertions(tape, jsxExtensions)
const renderer = createRenderer()
const render = jsx => {
  renderer.render(jsx)
  return renderer.getRenderOutput()
}

test('"withAuth" renders a FailureComponent when un-authenticated and your component when authenticated', async assert => {
  const FailureComponent = () => null
  const AuthenticatedHome = withAuth()(Home)

  assert.jsxEquals(
    render(<AuthenticatedHome isAuthenticated={false} />),
    <FailureComponent />,
    'When un-authenticated, render null (ie, the default FailureComponent)'
  )

  assert.jsxEquals(
    render(<AuthenticatedHome isAuthenticated />),
    <Home isAuthenticated />,
    'When authenticated, render the original Home component'
  )

  const FallbackComponent = () => <a href="/login">You must login</a>
  const HomeWithFallback = withAuth({ FailureComponent: FallbackComponent })(Home)

  const renderedOutput = render(<HomeWithFallback />)
  assert.jsxEquals(
    render(renderedOutput),
    <a href="/login">You must login</a>,
    'Custom FailureComponent'
  )

  const AuthenticatingComponent = () => null
  assert.jsxEquals(
    render(<AuthenticatedHome isAuthenticating />),
    <AuthenticatingComponent isAuthenticating />,
    'Optionally can have an AuthenticatingComponent'
  )

  assert.jsxNotEquals(
    render(<AuthenticatedHome isAuthenticated isAuthenticating />),
    <AuthenticatingComponent />,
    'AuthenticatingComponent does not show when authenticated'
  )

  const HomeWithToken = withAuth({ authenticatedSelector: 'token' })(Home)
  assert.jsxEquals(
    render(<HomeWithToken token={accessToken} />),
    <Home token={accessToken} />,
    'Can customize the authenticatedSelector'
  )

  const HomeWithPending = withAuth({ authenticatingSelector: 'pending' })(Home)
  assert.jsxEquals(
    render(<HomeWithPending pending />),
    <AuthenticatingComponent pending />,
    'Can also customize the authenticatingSelector'
  )

  const HomeWithToken2 = withAuth({ authenticatedSelector: p => p.token })(Home)
  assert.jsxEquals(
    render(<HomeWithToken2 token={accessToken} />),
    <Home token={accessToken} />,
    'Can customize the authenticatedSelector'
  )
  assert.jsxEquals(
    render(<HomeWithToken2 />),
    <FailureComponent />,
    'Custom selector works as expected'
  )

  const HomeWithPending2 = withAuth({ authenticatingSelector: p => p.pending })(Home)
  assert.jsxEquals(
    render(<HomeWithPending2 pending />),
    <AuthenticatingComponent pending />,
    'Can also customize the authenticatingSelector'
  )
  assert.jsxEquals(
    render(<HomeWithPending2 />),
    <FailureComponent />,
    'Custom selector works as expected'
  )

  assert.end()
})
