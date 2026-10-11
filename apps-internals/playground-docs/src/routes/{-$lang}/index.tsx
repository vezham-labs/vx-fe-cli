import { createFileRoute } from '@tanstack/react-router'

import { normalizeLocale } from '@vx/start/runtime/docs'

import { i18n } from '@app/docs'
import Page from '@pages/home'

const RouteComponent = () => {
  const { lang } = Route.useParams()

  return <Page locale={normalizeLocale(i18n, lang)} />
}

export const Route = createFileRoute('/{-$lang}/')({
  component: RouteComponent
})
