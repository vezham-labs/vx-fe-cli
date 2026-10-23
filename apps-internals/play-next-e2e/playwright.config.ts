import { defineConfig } from '@vezham/config/playwright'

export default defineConfig(__filename, {
  webServer: {
    env: { NODE_ENV: 'production' },
    command: 'pnpm exec nx run play-next:preview:next'
  }
})
