## API

#### How to read the API

* Parameter names beginning with `?` are optional
* `HigherOrderComponent` is a function of type:
  ```
    ReactClass | ReactFunctionalComponent | string =>
      ReactClass | ReactFunctionalComponent | string
  ```

## Redirection Helpers (React Router/History)

### `connectedRouterRedirect`

```js
import { connectedRouterRedirect } from 'react-auth-wrapper/redirectHelper'

connectedRouterRedirect({
  redirectPath: string | (state: Object, ownProps: Object) => string,
  authenticatedSelector: (state: Object, ownProps: Object) => boolean,
  ?authenticatingSelector: (state: Object, ownProps: Object) => boolean,
  ?AuthenticatingComponent: ReactClass | ReactFunctionalComponent | string,
  ?wrapperDisplayName: string,
  ?allowRedirectBack: boolean | (nextState: Object, redirectPath: String) => boolean,
  ?redirectQueryParamName: string
}): HigherOrderComponent
```

### `connectedReduxRedirect`

```js
import { connectedReduxRedirect } from 'react-auth-wrapper/redirectHelper'

connectedRouterRedirect({
  redirectPath: string | (state: Object, ownProps: Object) => string,
  redirectAction: (location: Object) => ReduxAction,
  authenticatedSelector: (state: Object, ownProps: Object) => boolean,
  ?authenticatingSelector: (state: Object, ownProps: Object) => boolean,
  ?AuthenticatingComponent: ReactClass | ReactFunctionalComponent | string,
  ?wrapperDisplayName: string,
  ?allowRedirectBack: boolean | (nextState: Object, redirectPath: String) => boolean,
  ?redirectQueryParamName: string
}): HigherOrderComponent
```

### `locationHelperBuilder`

```js
import locationHelperBuilder from 'react-auth-wrapper/locationHelper'

locationHelperBuilder({
  ?redirectQueryParamName: string,
  ?locationSelector: (props: Object) => LocationObject
}) : LocationHelper


LocationHelper: {
  getRedirectQueryParam: (props: Object) => string,
  createRedirectLoc: allowRedirectBack: boolean => (nextState: Object, redirectPath: string) => LocationObject,
}
```

## Other Wrappers

### `authWrapper`

```js
import authWrapper from 'react-auth-wrapper/authWrapper'

authWrapper({
  ?AuthenticatingComponent: ReactClass | ReactFunctionalComponent | string,
  ?FailureComponent: ReactClass | ReactFunctionalComponent | string,
  ?wrapperDisplayName: string
}): HigherOrderComponent
```

The returned Component after applying a Component to the HOC takes as props `isAuthenticated` and `isAuthenticating`, both of which are booleans. `isAuthenticating` defaults to `false`.

### `connectedAuthWrapper`

```js
import connectedAuthWrapper from 'react-auth-wrapper/connectedAuthWrapper'

connectedAuthWrapper({
  authenticatedSelector: (state: Object, ownProps: Object) => boolean,
  ?authenticatingSelector: (state: Object, ownProps: Object) => boolean,
  ?AuthenticatingComponent: ReactClass | ReactFunctionalComponent | string,
  ?FailureComponent: ReactClass | ReactFunctionalComponent | string,
  ?wrapperDisplayName: string
}): HigherOrderComponent
```
