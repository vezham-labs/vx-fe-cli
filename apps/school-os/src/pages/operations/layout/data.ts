import type { AppNavigationItem } from '@vezham/react'

import { getNavigationChildren } from '@generated/navigation'

export const operationsSidebarItems: AppNavigationItem[] =
  getNavigationChildren('operations')
