import createRedirectWrapper from './Redirect'
import withAuthFromContext from './withAuthFromContext'

export default createRedirectWrapper(withAuthFromContext)
