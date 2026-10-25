import { Outlet, createRootRoute } from '@tanstack/react-router'
import { lazy } from 'react'

import { __DEV__ } from '@vx/system-utils'

const TanStackRouterDevtools = lazy(() =>
  import('@tanstack/react-router-devtools').then(d => ({
    default: d.TanStackRouterDevtools
  }))
)

export const Route = createRootRoute({
  component: RootComponent
})

function RootComponent() {
  return (
    <>
      <Outlet />
      {__DEV__ ? <TanStackRouterDevtools position="bottom-right" /> : null}
    </>
  )
}
