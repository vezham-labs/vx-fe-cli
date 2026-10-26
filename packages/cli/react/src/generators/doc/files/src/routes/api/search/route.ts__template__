import { createFileRoute } from '@tanstack/react-router'

import { createSearchServer } from '@vezham/start/runtime/docs'

import { source } from '@app/docs'

const server = createSearchServer(source)

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async () => server.staticGET()
    }
  }
})
