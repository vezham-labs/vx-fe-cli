import { createLazyFileRoute } from '@tanstack/react-router'

import ClassesPageContent from '@pages/classes/content'

export const Route = createLazyFileRoute('/workspace/$')({
  component: ClassesPageContent
})
