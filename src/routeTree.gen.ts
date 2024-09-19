/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as CheckoutImport } from './routes/checkout'
import { Route as CartImport } from './routes/cart'
import { Route as IndexImport } from './routes/index'
import { Route as ShopProductsIndexImport } from './routes/shop/products/index'
import { Route as ShopProductProductIdImport } from './routes/shop/product/$productId'
import { Route as ShopCategoryCategoryIdImport } from './routes/shop/category/$categoryId'
import { Route as ShopProductProductIdEditImport } from './routes/shop/product_/$productId/edit'

// Create/Update Routes

const CheckoutRoute = CheckoutImport.update({
  path: '/checkout',
  getParentRoute: () => rootRoute,
} as any)

const CartRoute = CartImport.update({
  path: '/cart',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ShopProductsIndexRoute = ShopProductsIndexImport.update({
  path: '/shop/products/',
  getParentRoute: () => rootRoute,
} as any)

const ShopProductProductIdRoute = ShopProductProductIdImport.update({
  path: '/shop/product/$productId',
  getParentRoute: () => rootRoute,
} as any)

const ShopCategoryCategoryIdRoute = ShopCategoryCategoryIdImport.update({
  path: '/shop/category/$categoryId',
  getParentRoute: () => rootRoute,
} as any)

const ShopProductProductIdEditRoute = ShopProductProductIdEditImport.update({
  path: '/shop/product/$productId/edit',
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
    '/cart': {
      id: '/cart'
      path: '/cart'
      fullPath: '/cart'
      preLoaderRoute: typeof CartImport
      parentRoute: typeof rootRoute
    }
    '/checkout': {
      id: '/checkout'
      path: '/checkout'
      fullPath: '/checkout'
      preLoaderRoute: typeof CheckoutImport
      parentRoute: typeof rootRoute
    }
    '/shop/category/$categoryId': {
      id: '/shop/category/$categoryId'
      path: '/shop/category/$categoryId'
      fullPath: '/shop/category/$categoryId'
      preLoaderRoute: typeof ShopCategoryCategoryIdImport
      parentRoute: typeof rootRoute
    }
    '/shop/product/$productId': {
      id: '/shop/product/$productId'
      path: '/shop/product/$productId'
      fullPath: '/shop/product/$productId'
      preLoaderRoute: typeof ShopProductProductIdImport
      parentRoute: typeof rootRoute
    }
    '/shop/products/': {
      id: '/shop/products/'
      path: '/shop/products'
      fullPath: '/shop/products'
      preLoaderRoute: typeof ShopProductsIndexImport
      parentRoute: typeof rootRoute
    }
    '/shop/product/$productId/edit': {
      id: '/shop/product/$productId/edit'
      path: '/shop/product/$productId/edit'
      fullPath: '/shop/product/$productId/edit'
      preLoaderRoute: typeof ShopProductProductIdEditImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  CartRoute,
  CheckoutRoute,
  ShopCategoryCategoryIdRoute,
  ShopProductProductIdRoute,
  ShopProductsIndexRoute,
  ShopProductProductIdEditRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/cart",
        "/checkout",
        "/shop/category/$categoryId",
        "/shop/product/$productId",
        "/shop/products/",
        "/shop/product/$productId/edit"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/cart": {
      "filePath": "cart.tsx"
    },
    "/checkout": {
      "filePath": "checkout.tsx"
    },
    "/shop/category/$categoryId": {
      "filePath": "shop/category/$categoryId.tsx"
    },
    "/shop/product/$productId": {
      "filePath": "shop/product/$productId.tsx"
    },
    "/shop/products/": {
      "filePath": "shop/products/index.tsx"
    },
    "/shop/product/$productId/edit": {
      "filePath": "shop/product_/$productId/edit.tsx"
    }
  }
}
ROUTE_MANIFEST_END */