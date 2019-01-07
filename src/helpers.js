import url from 'url'

function encode(key, value) {
  return value === null
    ? encodeURIComponent(key)
    : [encodeURIComponent(key), '=', encodeURIComponent(value)].join('')
}

function stringify(obj) {
  if (!obj) return ''

  return Object.keys(obj).map(key => {
    const value = obj[key]
    if (value === undefined) return ''
    if (value === null) return encodeURIComponent(key)

    if (Array.isArray(value)) {
      const result = []
      value.filter(v => v !== 'undefined').forEach(val => {
        result.push(encode(key, val, result.length))
      })
      return result.join('&')
    }
    return encode(key, value)
  }).filter(Boolean).join('&')
}

function getFullRedirectPath(redirectQueryParamName = 'redirect', redirectPath, allowRedirectBack, location) {
  if (!redirectPath) return ''

  // eslint-disable-next-line no-undef
  const loc = location || (typeof window !== 'undefined' && window.location)
  const redirectLoc = url.parse(redirectPath, true)

  let query

  if (allowRedirectBack) {
    query = { [redirectQueryParamName]: `${loc.pathname}${loc.search}${loc.hash}` }
  } else {
    query = {}
  }

  query = { ...query, ...redirectLoc.query }

  return `${redirectLoc.pathname}${redirectLoc.hash}${stringify(query)}`
}

function validateStringOrFunction(val, name = 'prop') {
  if (typeof val === 'string') {
    return p => p[val]
  } else if (typeof val === 'function') {
    return val
  } else {
    throw new Error(`${name} must be either a string or a function`)
  }
}

function validateBoolOrFunction(val, name = 'prop') {
  if (typeof val === 'boolean') {
    return () => val
  } else if (typeof val === 'function') {
    return val
  } else {
    throw new Error(`${name} must be either a bool or a function`)
  }
}

export {
  encode,
  stringify,
  getFullRedirectPath,
  validateBoolOrFunction,
  validateStringOrFunction
}
