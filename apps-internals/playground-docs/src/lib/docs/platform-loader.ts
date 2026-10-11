import { notFound } from '@tanstack/react-router'

import { localizedUrl } from '@vx/start/runtime/docs'

import { i18n } from '@app/docs'
import { getPlatformDocsRuntime } from '@components/docs/platform-docs'
import { platformSections } from '@components/docs/platform-sections'
import { filterPlatformPageTree } from '@src/lib/docs/platform-page-tree'

type Params = {
  _splat?: string
  lang?: string
  platform: string
}

export const createPlatformDocsLoader =
  () =>
  async ({ params }: { params: Params }) => {
    if (params.platform !== 'web' && params.platform !== 'native')
      throw notFound()

    const sectionId = params._splat?.split('/')[0]
    const section = platformSections.find(item => item.id === sectionId)
    if (!section) throw notFound()

    const runtime = getPlatformDocsRuntime(params.platform)
    const data = await runtime.createDocsLoader()({ params })
    const routeBase = `/ui-notebook-platform/${params.platform}`
    const tree = runtime.source.getPageTree(data.locale)

    return {
      ...data,
      pageTree: await runtime.source.serializePageTree({
        ...tree,
        $id: `${data.locale}:${routeBase}:${section.id}`,
        name: section.title,
        children: filterPlatformPageTree({
          docsBase: localizedUrl(i18n, data.locale, routeBase),
          nodes: tree.children,
          prefix: section.prefix
        }),
        fallback: undefined
      })
    }
  }
