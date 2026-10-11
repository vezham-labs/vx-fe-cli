import { createFileRoute } from '@tanstack/react-router'

import { normalizeLocale } from '@vx/start/runtime/docs'

import { i18n } from '@app/docs'
import { LayoutPreviewPage } from '@pages/layouts'

const RouteComponent = () => {
  const { lang } = Route.useParams()
  return (
    <LayoutPreviewPage locale={normalizeLocale(i18n, lang)} layout="glass" />
  )
}

export const Route = createFileRoute('/{-$lang}/layouts/glass/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Glass Layout | Playground' }] })
})
