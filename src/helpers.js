function encode(key, value) {
  const keyOnly = value == null || (
    typeof value !== 'string' && typeof value !== 'number' && !Array.isArray(value)
  )
  return keyOnly
    ? encodeURIComponent(key)
    : [
      encodeURIComponent(key),
      '=',
      encodeURIComponent(value)
    ].join('')
}

function parse(strRaw, key) {
  if (typeof key !== 'string' || !key || typeof strRaw !== 'string' || !strRaw) {
    return ''
  }

  const decodedVal = strRaw.split('&')
    .filter(kv => kv.split('=')[0] === key && kv.split('=')[1])
    .map(kv => decodeURIComponent(kv.split('=')[1]))[0]

  try {
    if (/({|}|\[|\])/.test(decodedVal)) {
      return JSON.parse(decodedVal)
    }
  } catch (error) {
    // Failed to parse json
  }

  return decodedVal
}

function parseQs(qsRaw) {
  if (typeof qsRaw !== 'string' || !qsRaw) {
    return {}
  }

  return qsRaw
    .split('&')
    .filter(kv => kv.split('=')[1])
    .reduce((acc, kv) => ({
      ...acc, [kv.split('=')[0]]: decodeURIComponent(kv.split('=')[1])
    }), {})
}

function stringify(obj) {
  if (!obj) return ''

  return Object.keys(obj).map(key => {
    const value = obj[key]
    if (value === undefined) return ''
    if (value === null || (typeof value === 'string' && !value)) return encodeURIComponent(key)

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

function parseUrl(url) {
  let hash = ''
  let search = ''
  let pathname = ''

  const href = (url || '').trim()
  const protocolIndex = href.indexOf('://')
  const withoutProtocol = protocolIndex !== -1
    ? href.substring(protocolIndex + 3)
    : href

  // eslint-disable-next-line
  let [host, ...parts] = withoutProtocol.split('/').filter(Boolean)

  pathname = `/${parts.join('/') || host}`

  if (pathname.split('#').length === 2) {
    [pathname, hash] = pathname.split('#')
  }

  if (pathname.split('?').length === 2) {
    [pathname, search] = pathname.split('?')
  }

  const query = parseQs(search) || {}

  return {
    hash,
    host,
    query,
    search: search ? `?${search}` : search,
    href: href.replace(/\/$/, ''),
    pathname: pathname.replace(/\/$/, '')
  }
}

function getFullRedirectPath(redirectQueryParamName, redirectPath, allowRedirectBack, location) {
  if (!redirectPath) return ''

  // eslint-disable-next-line no-undef
  const redirectLoc = parseUrl(redirectPath)

  const qsRaw = location
    ? `${location.pathname || ''}${location.search || ''}${location.hash || ''}`
    : ''
  const query = allowRedirectBack && qsRaw
    ? { [redirectQueryParamName || 'redirect']: qsRaw }
    : {}

  const qs = stringify({ ...query, ...redirectLoc.query })

  return `${redirectLoc.pathname || ''}${redirectLoc.hash || ''}${qs ? `?${qs}` : ''}`
}

function validateStringOrFunction(val, name = 'prop') {
  if (typeof val === 'string') {
    return p => p && p[val]
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
  parse,
  parseQs,
  parseUrl,
  stringify,
  getFullRedirectPath,
  validateBoolOrFunction,
  validateStringOrFunction
}
