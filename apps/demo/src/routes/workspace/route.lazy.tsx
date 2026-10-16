import { createLazyFileRoute } from '@tanstack/react-router'

import ClassesLayout from '@pages/classes'

export const Route = createLazyFileRoute('/workspace')({
  component: () => <ClassesLayout menuKey="workspace" />
})
