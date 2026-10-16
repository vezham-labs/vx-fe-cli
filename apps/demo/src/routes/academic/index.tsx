import { createFileRoute, redirect } from '@tanstack/react-router'

import { getNavigationChildren } from '@generated/navigation'
import { getDefaultDestination } from '@pages/classes/navigation'

export const Route = createFileRoute('/academic/')({
  beforeLoad: () => {
    throw redirect({
      to: getDefaultDestination(getNavigationChildren('academic')[0])
    })
  }
})
