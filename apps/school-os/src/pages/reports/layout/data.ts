import type { AppNavigationItem } from '@vezham/react'

import { getNavigationChildren } from '@generated/navigation'

export const reportsSidebarItems: AppNavigationItem[] =
  getNavigationChildren('reports')
