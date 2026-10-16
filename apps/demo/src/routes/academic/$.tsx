import { createFileRoute, redirect } from '@tanstack/react-router'

import ClassesPageContent from '@pages/classes/content'
import {
  getDefaultDestination,
  getNavigationPage
} from '@pages/classes/navigation'

export const Route = createFileRoute('/academic/$')({
  beforeLoad: ({ location }) => {
    const { page } = getNavigationPage('academic', location.pathname)
    if (page.children?.length)
      throw redirect({ to: getDefaultDestination(page), replace: true })
  },
  component: ClassesPageContent
})
