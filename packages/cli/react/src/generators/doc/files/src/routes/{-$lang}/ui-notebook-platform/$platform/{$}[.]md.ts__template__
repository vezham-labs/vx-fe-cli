import { createFileRoute } from '@tanstack/react-router'

import { getPlatformDocsRuntime } from '@components/docs/platform-docs'

export const Route = createFileRoute(
  '/{-$lang}/ui-notebook-platform/$platform/{$}.md'
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (params.platform !== 'web' && params.platform !== 'native')
          return new Response(null, { status: 404 })

        const runtime = getPlatformDocsRuntime(params.platform)
        const { page } = runtime.getDocsPage({
          slugs: params._splat?.split('/') ?? [],
          lang: params.lang,
          pathFormat: 'markdown-url'
        })

        return new Response(await runtime.getLLMText(page), {
          headers: {
            'Content-Type': 'text/markdown'
          }
        })
      }
    }
  }
})
