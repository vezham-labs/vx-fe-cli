import { createLazyFileRoute } from '@tanstack/react-router'

import Page from '@pages/pro'

export const Route = createLazyFileRoute('/{-$lang}/pro')({
  component: Page
})
