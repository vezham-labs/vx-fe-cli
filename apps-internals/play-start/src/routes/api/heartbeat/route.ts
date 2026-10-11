import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/heartbeat')({
  server: {
    handlers: {
      // eslint-disable-next-line unused-imports/no-unused-vars
      GET: async ({ request }) => {
        return Response.json({ status: true })
      }
    }
  }
})
