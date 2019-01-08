import tape from 'tape'
import React from 'react'
import { create } from 'react-test-renderer'
import addAsertions from 'extend-tape'
import jsxExtensions from 'tape-react-extensions'

import withAuthAndRedirect from '../src/withAuthAndRedirect'
import Home, { jsonHome } from './__mocks__/Home'

const test = addAsertions(tape, jsxExtensions)

test('"withAuthAndRedirect" redirects when un-authenticated and your component when authenticated', async assert => {
  const AuthenticatedHome = withAuthAndRedirect()(Home)
  const renderedRedirect = create(<AuthenticatedHome isAuthenticated={false} />)

  assert.deepEqual(
    renderedRedirect.toJSON(),
    null,
    'When un-authenticated, render null (ie, the default FailureComponent)'
  )

  const location = (() => {
    let redirectPath = ''
    return {
      getPath() {
        return redirectPath
      },
      replace(p) {
        redirectPath = p
      }
    }
  })()

  const renderedHomeLocation = create(
    <AuthenticatedHome location={location} redirectPath="/home" />
  )

  assert.deepEqual(
    location.getPath(),
    '/home',
    'When authenticated, render the original Home component'
  )
  assert.deepEqual(
    renderedHomeLocation.toJSON(),
    null,
    'But make sure the rendered value is nil'
  )

  const history = (() => {
    const pushed = []
    return {
      getPaths() {
        return pushed.join('')
      },
      push(p) {
        pushed.push(p)
      }
    }
  })()

  const renderedHomeHistory = create(
    <AuthenticatedHome history={history} location={location} redirectPath="/home" />
  )

  assert.deepEqual(
    history.getPaths(),
    '/home',
    'Favors History over location'
  )
  assert.deepEqual(
    renderedHomeHistory.toJSON(),
    null,
    'But make sure the rendered value is nil'
  )

  const renderedHome = create(
    <AuthenticatedHome history={history} location={location} redirectPath="/home" isAuthenticated />
  )
  assert.deepEqual(
    renderedHome.toJSON(),
    jsonHome,
    'renders the Home component when authenticated'
  )

  assert.end()
})
