import type { AppNavigationItem } from '@vezham/react'

import { getNavigationChildren } from '@generated/navigation'

export const sidebarItems: AppNavigationItem[] =
  getNavigationChildren('academic')
