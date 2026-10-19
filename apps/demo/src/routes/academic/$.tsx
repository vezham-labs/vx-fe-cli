import { createFileRoute, redirect } from '@tanstack/react-router'

import {
  getClassFilterSearch,
  getClassFiltersFromSearch
} from '@pages/classes/classes-content/utils'
import ClassesPageContent from '@pages/classes/content'
import {
  getDefaultDestination,
  getNavigationPage
} from '@pages/classes/navigation'

export const Route = createFileRoute('/academic/$')({
  validateSearch: (search: Record<string, unknown>) =>
    getClassFilterSearch(getClassFiltersFromSearch(search)),
  beforeLoad: ({ location }) => {
    const { page } = getNavigationPage('academic', location.pathname)
    if (page.children?.length)
      throw redirect({ to: getDefaultDestination(page), replace: true })
  },
  component: ClassesPageContent
})
