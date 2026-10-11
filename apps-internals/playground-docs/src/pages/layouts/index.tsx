import { DocsLayout } from '@vezham/docs-react/layouts/docs'
import * as DocsPage from '@vezham/docs-react/layouts/docs/page'
import { DocsLayout as FluxLayout } from '@vezham/docs-react/layouts/flux'
import * as FluxPage from '@vezham/docs-react/layouts/flux/page'
import { GlassLayout } from '@vezham/docs-react/layouts/glass'
import * as GlassPage from '@vezham/docs-react/layouts/glass/page'
import { HomeLayout } from '@vezham/docs-react/layouts/home'
import { DocsLayout as NotebookLayout } from '@vezham/docs-react/layouts/notebook'
import * as NotebookPage from '@vezham/docs-react/layouts/notebook/page'

import type { Locale } from '@generated/vx'

import { LayoutLinks, PreviewContent, previewToc } from './content'
import {
  type LayoutPreview,
  layoutPreviews,
  previewOptions,
  previewTree
} from './options'

type Props = { locale: Locale; layout?: LayoutPreview }

const documentationLayouts = {
  docs: { Layout: DocsLayout, page: DocsPage },
  flux: { Layout: FluxLayout, page: FluxPage },
  glass: { Layout: GlassLayout, page: GlassPage },
  notebook: { Layout: NotebookLayout, page: NotebookPage }
}

export const LayoutPreviewPage = ({ locale, layout }: Props) => {
  const options = previewOptions(locale)
  const selected = layoutPreviews.find(item => item.id === layout)

  if (!layout || layout === 'home') {
    return (
      <HomeLayout {...options}>
        <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
          <p className="text-fd-muted-foreground mb-3 text-sm">
            Layout playground
          </p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight">
            {selected?.title ?? 'Explore the layouts'}
          </h1>
          <p className="text-fd-muted-foreground mb-10 max-w-2xl text-lg">
            {selected?.description ??
              'Five layouts, one playground. Compare navigation, themes, and responsive behavior.'}
          </p>
          {layout === 'home' ? (
            <div className="prose max-w-none">
              <PreviewContent locale={locale} />
            </div>
          ) : (
            <LayoutLinks locale={locale} />
          )}
        </div>
      </HomeLayout>
    )
  }

  const { Layout, page } = documentationLayouts[layout]
  return (
    <Layout {...options} tree={previewTree(locale)}>
      <page.DocsPage toc={previewToc}>
        <page.DocsTitle>{selected?.title}</page.DocsTitle>
        <page.DocsDescription>{selected?.description}</page.DocsDescription>
        <page.DocsBody>
          <PreviewContent locale={locale} />
        </page.DocsBody>
      </page.DocsPage>
    </Layout>
  )
}
