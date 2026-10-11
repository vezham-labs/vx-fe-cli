import type { Root } from '@vezham/docs-core/page-tree'
import type { BaseLayoutProps } from '@vezham/docs-react/layouts/shared'

import { localizedUrl } from '@vx/start/runtime/docs'

import { i18n } from '@app/docs'
import { baseOptions } from '@config/layout'
import type { Locale } from '@generated/vx'

export const layoutPreviews = [
  {
    id: 'docs',
    title: 'Docs Layout',
    description:
      'A familiar documentation sidebar with a dedicated table of contents.'
  },
  {
    id: 'flux',
    title: 'Flux Layout',
    description: 'A minimal reading surface with a floating navigation panel.'
  },
  {
    id: 'glass',
    title: 'Glass Layout',
    description:
      'Floating, translucent panels for navigation and page contents.'
  },
  {
    id: 'home',
    title: 'Home Layout',
    description: 'A full-width landing page with a shared navigation header.'
  },
  {
    id: 'notebook',
    title: 'Notebook Layout',
    description:
      'A compact documentation layout with notebook-style navigation.'
  }
] as const

export type LayoutPreview = (typeof layoutPreviews)[number]['id']

export const previewOptions = (locale: Locale): BaseLayoutProps => ({
  ...baseOptions(locale),
  nav: {
    title: 'Layout previews',
    url: localizedUrl(i18n, locale, '/layouts')
  },
  links: layoutPreviews.map(({ id, title }) => ({
    text: title.replace(' Layout', ''),
    url: localizedUrl(i18n, locale, `/layouts/${id}`),
    active: 'nested-url' as const
  }))
})

export const previewTree = (locale: Locale): Root => ({
  $id: `layout-previews-${locale}`,
  name: 'Layout previews',
  children: layoutPreviews.map(({ id, title }) => ({
    $id: `layout-preview-${locale}-${id}`,
    type: 'page',
    name: title,
    url: localizedUrl(i18n, locale, `/layouts/${id}`)
  }))
})
