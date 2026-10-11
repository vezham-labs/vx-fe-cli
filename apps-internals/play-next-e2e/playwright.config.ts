import { defineConfig } from '@vx/config/playwright'

export default defineConfig(__filename, {
  webServer: {
    env: { NODE_ENV: 'production' },
    command: 'pnpm exec nx run play-next:preview:next'
  }
})
