import { createRootRoute } from '@tanstack/react-router'

import {
  createRootComponent,
  redirectDefaultLocale
} from '@vx/start/tanstack-docs'

import { i18n } from '@app/docs'
import { tanstackHead } from '@generated/vx'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => redirectDefaultLocale(i18n, location),
  head: () => tanstackHead,
  component: createRootComponent({ i18n })
})
