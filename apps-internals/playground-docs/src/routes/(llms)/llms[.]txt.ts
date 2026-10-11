import { createFileRoute } from '@tanstack/react-router'

import { getDocsLLMSIndex } from '@vx/start/runtime/docs'

import { source } from '@app/docs'

export const Route = createFileRoute('/(llms)/llms.txt')({
  server: {
    handlers: {
      GET: () => new Response(getDocsLLMSIndex(source))
    }
  }
})
