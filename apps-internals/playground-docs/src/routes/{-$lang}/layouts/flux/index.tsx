import { createFileRoute } from '@tanstack/react-router'

import { normalizeLocale } from '@vx/start/runtime/docs'

import { i18n } from '@app/docs'
import { LayoutPreviewPage } from '@pages/layouts'

const RouteComponent = () => {
  const { lang } = Route.useParams()
  return (
    <LayoutPreviewPage locale={normalizeLocale(i18n, lang)} layout="flux" />
  )
}

export const Route = createFileRoute('/{-$lang}/layouts/flux/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Flux Layout | Playground' }] })
})
