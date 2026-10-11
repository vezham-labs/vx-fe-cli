import { defineDocs } from '@vezham/docs-mdx/macro'

import {
  createStaticDocsRuntime,
  docsMetaSchema,
  docsPageSchema
} from '@vx/start/runtime/docs'

import { vxCore, vxDocs, vxI18n, vxMetadata } from '@generated/vx'

const webPlatformDocs = defineDocs({
  dir: 'content/platform-docs/web',
  docs: {
    async: true,
    postprocess: { includeProcessedMarkdown: true },
    schema: docsPageSchema
  },
  meta: {
    schema: docsMetaSchema
  }
})

const nativePlatformDocs = defineDocs({
  dir: 'content/platform-docs/native',
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

const runtimeOptions = {
  i18n: vxI18n,
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
}

const runtimes = {
  web: createStaticDocsRuntime({
    ...runtimeOptions,
    docs: webPlatformDocs,
    docsRoute: '/ui-notebook-platform/web'
  }),
  native: createStaticDocsRuntime({
    ...runtimeOptions,
    docs: nativePlatformDocs,
    docsRoute: '/ui-notebook-platform/native'
  })
}

export const getPlatformDocsRuntime = (platform: 'web' | 'native') =>
  runtimes[platform]

export const getPlatformDocs = (platform: 'web' | 'native') =>
  platform === 'web' ? webPlatformDocs : nativePlatformDocs
