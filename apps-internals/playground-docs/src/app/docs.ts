import { defineDocs } from '@vezham/docs-mdx/macro'

import {
  createStaticDocsRuntime,
  docsMetaSchema,
  docsPageSchema
} from '@vx/start/runtime/docs'

import { vxCore, vxDocs, vxI18n, vxMetadata } from '@generated/vx'

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    async: true,
    postprocess: { includeProcessedMarkdown: true },
    schema: docsPageSchema
  },
  meta: {
    schema: docsMetaSchema
  }
})

const openapiFiles = import.meta.glob<string>('/openapi/**/*.{json,yaml,yml}', {
  eager: true,
  import: 'default',
  query: '?raw'
})

export const {
  i18n,
  source,
  getDocsPage,
  getDocsRouteHead,
  getLLMText,
  createDocsLoader
} = createStaticDocsRuntime({
  i18n: vxI18n,
  docs,
  docsRoute: vxDocs.docsRoute,
  openapiDir: vxDocs.openapiDir,
  openapiFiles,
  head: {
    appName: vxCore.shortName,
    docsImageRoute: vxDocs.docsImageRoute,
    openGraphImage: vxMetadata.openGraph.image,
    openGraphImageSource: vxMetadata.openGraph.imageSource,
    siteDescription: vxMetadata.description,
    siteUrl: vxMetadata.url
  }
})
