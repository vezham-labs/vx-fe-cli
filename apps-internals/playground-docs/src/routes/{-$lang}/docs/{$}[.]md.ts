import { createFileRoute } from '@tanstack/react-router'

import { getDocsPage, getLLMText } from '@app/docs'

export const Route = createFileRoute('/{-$lang}/docs/{$}.md')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { page } = getDocsPage({
          slugs: params._splat?.split('/') ?? [],
          lang: params.lang,
          pathFormat: 'markdown-url'
        })

        return new Response(await getLLMText(page), {
          headers: {
            'Content-Type': 'text/markdown'
          }
        })
      }
    }
  }
})
