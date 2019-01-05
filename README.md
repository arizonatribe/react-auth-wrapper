# React Auth Wrapper

**Decouple your Authentication and Authorization from your components!**

`react-auth-wrapper` is a utility library for handling authentication and authorization in react + react-router applications.

**Note**: This is a fork of a prior work that was directly coupled to Redux. See
the [original work by Matt Russell](https://github.com/mjrussell/redux-auth-wrapper) to compare.

## Installation

```bash
npm install --save react-auth-wrapper
```

## Usage

This package exports four different higher-order components that you can use to
wrap any component that needs to verify authentication status prior to rendering
in your app.

  * withAuth - checks for `isAuthenticated` and `isAuthenticating` props to show or hide your component
  * withAuthFromContext - Like `withAuth` except you also provide your [Context Consumer](https://reactjs.org/docs/context.html#contextconsumer) that holds your auth info (and any optional selector/prop-name if `isAuthenticated` and `isAuthenticating` are not inside your Context provider's state)
  * withAuthAndRedirect - Like `withAuth` except will also allow redirecting to a given URL/route when un-authenticated and return to your component once authenticated
  * withAuthFromContextAndRedirect - Like `withAuthFromContext` except will also allow redirecting to a given URL/route when un-authenticated and return to your component once authenticated

## Docs

View the [full docs](https://arizonatribe.github.io/react-auth-wrapper/). These are always in-sync with the JsDoc code annotations.
