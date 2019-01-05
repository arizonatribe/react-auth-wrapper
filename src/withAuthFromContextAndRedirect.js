import createRedirectWrapper from './Redirect'
import withAuthFromContext from './withAuthFromContext'

/**
 * A simple wrapper to any component that will only display the component if the user is in an authenticated state.
 * Unlike the `withAuth` higher-order component, this one will default to a given route or relative URL when authentication fails.
 * Additionally, it is driven by a context consumer component (one of the props returned in the output of [React.createContext()](https://reactjs.org/docs/context.html#reactcreatecontext)).
 * It will look for props injected into the component to determine whether to display either:
 *   - A Failure Component (when the `authenticatedSelector` returns `false`, but will default to render a redirect component)
 *   - An Authenticating/Pending Component (when `authenticatingSelector` returns `true` and `authenticatedSelector` also returns `false`)
 *   - Your actual Component (when the `authenticatedSelector` returns `true`)
 *
 * @func
 * @sig {k: v} -> (Component -> ({k: v} -> Component))
 * @param {Function|String} args.authenticatedSelector A prop name OR a selector function
 * that will find the prop injected into the component that identifies whether the user is authenticated or not
 * (defaults to look for a prop named `isAuthenticated`)
 * @param {Function|String} args.authenticatingSelector A prop name OR a selector function
 * that will find the prop injected into the component that identifies whether the user authentication
 * is in-progress or not (defaults to look for a prop named `isAuthenticating`)
 * @param {Function|String} args.redirectPath A prop name OR a selector function
 * that will find the prop injected into the component that identifies the
 * route or relative URL to send the user to when authentication fails
 * @param {Function} args.AuthenticatingComponent An optional component that would be
 * displaying while authentication is in-progress (defaults to an empty
 * Component that returns `null`)
 * @param {Function} args.ContextConsumer An instance of a `.Consumer` from the context object that
 * [React.createContext()](https://reactjs.org/docs/context.html#reactcreatecontext) returns
 * @param {Boolean} args.allowRedirectBack Whether or not to redirect back to
 * the original location after authentication completes successfully
 * @param {Function} args.FailureComponent An optional component that would be diplayed
 * when authentication fails (defaults to a Component Component that returns `null`, _but_
 * redirects to whatever it finds on the `redirectPath`)
 * @param {String} args.wrapperDisplayName An optional display name to give to
 * the wrapper component (defaults to just 'AuthWrapper')
 * @param {String} args.redirectQueryParamName An optional prop name to identify
 * the route/relative-URL from the component's injected props
 * @returns {Function} A function that is ready to receive a Component to decorate
 */
const withAuthFromContextAndRedirect = createRedirectWrapper(withAuthFromContext)

export default withAuthFromContextAndRedirect
