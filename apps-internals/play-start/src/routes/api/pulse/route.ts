import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/pulse')({
  server: {
    handlers: {
      // eslint-disable-next-line unused-imports/no-unused-vars
      GET: async ({ request }) => {
        return new Response('API: Hello World')
      }
    }
  }
})
