/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as UnauthenticatedIndexImport } from './routes/unauthenticated/index'
import { Route as RegisterIndexImport } from './routes/register/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as HomeIndexImport } from './routes/home/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const UnauthenticatedIndexRoute = UnauthenticatedIndexImport.update({
  id: '/unauthenticated/',
  path: '/unauthenticated/',
  getParentRoute: () => rootRoute,
} as any)

const RegisterIndexRoute = RegisterIndexImport.update({
  id: '/register/',
  path: '/register/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  id: '/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const HomeIndexRoute = HomeIndexImport.update({
  id: '/home/',
  path: '/home/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/home/': {
      id: '/home/'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeIndexImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/register/': {
      id: '/register/'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterIndexImport
      parentRoute: typeof rootRoute
    }
    '/unauthenticated/': {
      id: '/unauthenticated/'
      path: '/unauthenticated'
      fullPath: '/unauthenticated'
      preLoaderRoute: typeof UnauthenticatedIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/home': typeof HomeIndexRoute
  '/login': typeof LoginIndexRoute
  '/register': typeof RegisterIndexRoute
  '/unauthenticated': typeof UnauthenticatedIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/home': typeof HomeIndexRoute
  '/login': typeof LoginIndexRoute
  '/register': typeof RegisterIndexRoute
  '/unauthenticated': typeof UnauthenticatedIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/home/': typeof HomeIndexRoute
  '/login/': typeof LoginIndexRoute
  '/register/': typeof RegisterIndexRoute
  '/unauthenticated/': typeof UnauthenticatedIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/home' | '/login' | '/register' | '/unauthenticated'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/home' | '/login' | '/register' | '/unauthenticated'
  id:
    | '__root__'
    | '/'
    | '/home/'
    | '/login/'
    | '/register/'
    | '/unauthenticated/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  HomeIndexRoute: typeof HomeIndexRoute
  LoginIndexRoute: typeof LoginIndexRoute
  RegisterIndexRoute: typeof RegisterIndexRoute
  UnauthenticatedIndexRoute: typeof UnauthenticatedIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  HomeIndexRoute: HomeIndexRoute,
  LoginIndexRoute: LoginIndexRoute,
  RegisterIndexRoute: RegisterIndexRoute,
  UnauthenticatedIndexRoute: UnauthenticatedIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/home/",
        "/login/",
        "/register/",
        "/unauthenticated/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/home/": {
      "filePath": "home/index.tsx"
    },
    "/login/": {
      "filePath": "login/index.tsx"
    },
    "/register/": {
      "filePath": "register/index.tsx"
    },
    "/unauthenticated/": {
      "filePath": "unauthenticated/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
