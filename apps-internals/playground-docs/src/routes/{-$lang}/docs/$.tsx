import { createFileRoute } from '@tanstack/react-router'

import { DocsRoutePage } from '@vx/start/pages/docs/route'

import { createDocsLoader, docs, getDocsRouteHead } from '@app/docs'
import { baseOptions } from '@config/layout'

const RouteComponent = () => (
  <DocsRoutePage
    data={Route.useLoaderData()}
    docs={docs}
    getLayoutOptions={baseOptions}
  />
)

export const Route = createFileRoute('/{-$lang}/docs/$')({
  component: RouteComponent,
  head: ({ loaderData }) => getDocsRouteHead(loaderData),
  loader: createDocsLoader()
})
