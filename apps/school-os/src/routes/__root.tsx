import { createRootRoute } from '@tanstack/react-router'

import { AppLayout } from '@vezham/react/layouts/app'
import { createRootComponent } from '@vezham/start/tanstack'

import { appMenu, navigationItems } from '@generated/navigation'
import { tanstackHead, vxI18n } from '@generated/vx'

export const Route = createRootRoute({
  head: () => tanstackHead,
  component: createRootComponent({
    lang: vxI18n.defaultLanguage,
    children: <AppLayout navigationItems={navigationItems} appMenu={appMenu} />
  })
})
