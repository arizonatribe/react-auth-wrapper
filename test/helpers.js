import test from 'tape'
import {
  encode,
  parse,
  parseQs,
  parseUrl,
  stringify,
  getFullRedirectPath,
  validateStringOrFunction,
  validateBoolOrFunction
} from '../src/helpers'

test('encode', assert => {
  assert.equal(encode('lorem', 'ipsum'), 'lorem=ipsum', '')
  assert.equal(encode('lorem', null), 'lorem')
  assert.equal(encode('lorem'), 'lorem')
  assert.end()
})

test('parse', assert => {
  assert.equal(parse('redirect=home&name=john&age=20', 'redirect'), 'home')
  assert.deepEqual(
    parse('data=%7B%22lorem%22%3A%22ipsum%22%2C%22dolor%22%3A%22sit%22%2C%22amet%22%3A0%7D', 'data'),
    { lorem: 'ipsum', dolor: 'sit', amet: 0 }
  )
  assert.end()
})

test('parseQs', assert => {
  assert.deepEqual(
    parseQs('redirect=home&name=john&age=20'),
    { redirect: 'home', name: 'john', age: '20' }
  )
  assert.deepEqual(parseQs(''), {})
  assert.deepEqual(parseQs('lorem'), {})
  assert.end()
})

test('parseUrl', assert => {
  assert.deepEqual(
    parseUrl('http://lorem.com/ipsum?dolor=sit&redirect=home&amet=0'), {
      hash: '',
      host: 'lorem.com',
      pathname: '/ipsum',
      search: '?dolor=sit&redirect=home&amet=0',
      href: 'http://lorem.com/ipsum?dolor=sit&redirect=home&amet=0',
      query: {
        dolor: 'sit',
        amet: '0',
        redirect: 'home'
      }
    }
  )
  // assert.deepEqual(parseUrl(''), {})
  // assert.deepEqual(parseUrl('lorem'), {})
  assert.end()
})

test('stringify', assert => {
  assert.equal(stringify({ lorem: 'ipsum' }), 'lorem=ipsum')
  assert.equal(
    stringify({ lorem: 'ipsum', dolor: 'sit', amet: 0 }),
    'lorem=ipsum&dolor=sit&amet=0'
  )
  assert.equal(stringify({ lorem: null }), 'lorem')
  assert.equal(stringify({}), '')
  assert.end()
})

test('getFullRedirectPath', assert => {
  assert.equal(getFullRedirectPath('redirect', '/login'), '/login')
  assert.equal(
    getFullRedirectPath('redirect', '/login?lorem=ipsum', true, { pathname: 'home' }),
    '/login?redirect=home&lorem=ipsum'
  )
  assert.equal(
    getFullRedirectPath('redirect', '/login?lorem=ipsum', false, { pathname: 'home' }),
    '/login?lorem=ipsum'
  )
  assert.end()
})

test('validateBoolOrFunction', assert => {
  assert.equal(validateBoolOrFunction(true)(), true)
  assert.equal(validateBoolOrFunction(false)(), false)
  assert.equal(validateBoolOrFunction(() => 42)(), 42)
  assert.throws(() => validateBoolOrFunction(null))
  assert.throws(() => validateBoolOrFunction({}))
  assert.end()
})

test('validateStringOrFunction', assert => {
  assert.equal(validateStringOrFunction('someProp')({ someProp: 'someVal' }), 'someVal')
  assert.equal(validateStringOrFunction('')(), undefined)
  assert.equal(validateStringOrFunction(p => p.someProp)({ someProp: 42 }), 42)
  assert.throws(() => validateStringOrFunction(null))
  assert.throws(() => validateStringOrFunction({}))
  assert.end()
})
