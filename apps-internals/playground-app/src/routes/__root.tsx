import { createRootRoute } from '@tanstack/react-router'

import { createRootComponent } from '@vx/start/tanstack'

import { tanstackHead, vxI18n } from '@generated/vx'

export const Route = createRootRoute({
  head: () => tanstackHead,
  component: createRootComponent({ lang: vxI18n.defaultLanguage })
})
